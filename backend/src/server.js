const fs = require('fs');
const { mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const bodyParser = require('body-parser');
const { SELECT_PROBLEM_CATEGORY_COUNT_QUERY } = require('./dbUtils');
const {
  authenticationMiddleware,
  loginRoute,
  websocketAuthenticationMiddleware,
} = require('./auth');

const db = require('./datasources/db');

const { ticketResolvers, ticketSchemas } = require('./tickets');
const { userResolvers, userSchemas } = require('./users');

const isDev = process.env.NODE_ENV && process.env.NODE_ENV !== 'production';

const Project = db.getORM().models.project;
const ProblemCategory = db.getORM().models.problemCategory;
const Ticket = db.getORM().models.ticket;
const Task = db.getORM().models.task;
const Problem = db.getORM().models.problem;

const defaultTypeDefs = `
  type Query {
    problemCategories: [ProblemCategory]
    problemCategoriesWithCount: [ProblemCategoryWithCount]
  }
  type Project {
    id: Int
    name: String
    dailyDevelopmentTime: Int
    celerity: Int
    thirdPartyType: String
    thirdPartyId: String
  }
  type Task {
    id: Int
    description: String
    estimatedTime: Int,
    realTime: Int,
    addedOnTheFly: Boolean,
    problems: [Problem]
  }
  input TaskInput {
    id: Int,
    ticketId: Int,
    description: String,
    estimatedTime: Int,
    realTime: Int,
    addedOnTheFly: Boolean,
    problems: [ProblemInput],
  }
  type Problem {
    id: Int
    description: String
    problemCategory: ProblemCategory
  }
  input ProblemInput {
    id: Int
    description: String
    problemCategory: ProblemCategoryInput
  }
  type ProblemCategory {
    id: Int
    description: String
  }
  input ProblemCategoryInput {
    id: Int
    description: String
  }
  type ProblemCategoryWithCount {
    id: Int
    description: String
    count: Int
  }
  input ProjectInput {
    name: String
    thirdPartyId: String
  }
  input ProjectSpeedInput {
    celerity: Int
    dailyDevelopmentTime: Int
  }
  input PaginationInput {
    limit: Int = 0
    offset: Int = 0
  }
  type Mutation {
    updateCurrentState(state: String!): Int,
    updateTask(task: TaskInput!): Task,
    selectProject(project: ProjectInput): Project,
    addProblemCategory(problemCategoryDescription: String): ProblemCategory,
    setCurrentProjectSpeed(projectSpeed: ProjectSpeedInput!): Int
  }
  type Subscription {
    state: String!
  }
`;

const typeDefs = mergeTypes([defaultTypeDefs, ticketSchemas, userSchemas], { all: true });

const defaultResolvers = {
  Query: {
    problemCategories: () => ProblemCategory.findAll(),
    problemCategoriesWithCount: (_, args, { user }) => {
      const projectId = user.currentProject.id;
      return db.getORM().query(SELECT_PROBLEM_CATEGORY_COUNT_QUERY, {
        replacements: [projectId],
        type: db.getORM().QueryTypes.SELECT,
      });
    },
  },
  Mutation: {
    updateCurrentState: async (_, { state }, { pubsub, user }) => {
      const channel = 'user#' + user.id;
      pubsub.publish(channel, { state });
      user.set('state', state);
      user.save();
      return 1;
    },
    updateTask: async (_, { task }) => {
      const taskToUpdate = await Task.findById(task.id, {
        include: [{ model: Problem, as: 'problems' }],
      });
      const ticketToUpdate = await Ticket.findById(task.ticketId);
      const updatedEstimatedTime =
        ticketToUpdate.estimatedTime + task.estimatedTime - taskToUpdate.estimatedTime;
      const updatedRealTime = ticketToUpdate.realTime + task.realTime - taskToUpdate.realTime;
      ticketToUpdate.update({ estimatedTime: updatedEstimatedTime, realTime: updatedRealTime });
      taskToUpdate.update(task);
      Problem.destroy({ where: { taskId: taskToUpdate.id } });
      if (task.problems) {
        task.problems.forEach(async formattedProblem => {
          formattedProblem.taskId = taskToUpdate.id;
          const problem = await Problem.create(formattedProblem);
          formattedProblem.problemCategory &&
            problem.setProblemCategory(formattedProblem.problemCategory.id);
          problem.save();
        });
      }
      return taskToUpdate;
    },
    selectProject: (_, { project }, { user }) => {
      project.thirdPartyType = 'TRELLO';
      return Project.findOrCreate({
        where: { thirdPartyId: project.thirdPartyId },
        defaults: { ...project },
      }).spread(project => {
        user.setCurrentProject(project.id);
        return project;
      });
    },
    addProblemCategory: (_, { problemCategoryDescription }) => {
      return ProblemCategory.create({
        description: problemCategoryDescription,
      });
    },
    setCurrentProjectSpeed: async (_, { projectSpeed }, { user }) => {
      const project = user.get('currentProject');
      Project.update(
        {
          celerity: projectSpeed.celerity,
          dailyDevelopmentTime: projectSpeed.dailyDevelopmentTime,
        },
        { where: { id: project.id } },
      );
      return 1;
    },
  },
  Subscription: {
    state: {
      subscribe: (_, args, { user }) => {
        const channel = 'user#' + user.id;
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const resolvers = mergeResolvers([ticketResolvers, userResolvers, defaultResolvers]);

const pubsub = new PubSub();
const defaultContext = {
  pubsub,
};
const context = async ({ request, connection }) => ({
  user: request ? request.user : connection ? connection.context.user : undefined,
  ...defaultContext,
});

const server = new GraphQLServer({ typeDefs, resolvers, context });

server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware);
server.express.post(`/login`, bodyParser.json(), loginRoute);

const serverOptions = isDev
  ? { subscriptions: { onConnect: websocketAuthenticationMiddleware } }
  : {
      https: {
        cert: fs.readFileSync('/home/ubuntu/certificates/cert.pem', 'utf8'),
        key: fs.readFileSync('/home/ubuntu/certificates/privkey.pem', 'utf8'),
      },
      subscriptions: { onConnect: websocketAuthenticationMiddleware },
    };

module.exports = {
  server,
  serverOptions,
};