const fs = require('fs');
const { mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const bodyParser = require('body-parser');
const {
  authenticationMiddleware,
  loginRoute,
  websocketAuthenticationMiddleware,
} = require('./auth');

const db = require('./datasources/db');

const { ticketResolvers, ticketSchemas } = require('./tickets');
const { userResolvers, userSchemas } = require('./users');
const { problemCategoriesResolvers, problemCategoriesSchemas } = require('./problemCategories');

const isDev = process.env.NODE_ENV && process.env.NODE_ENV !== 'production';

const Project = db.getORM().models.project;
const Ticket = db.getORM().models.ticket;
const Task = db.getORM().models.task;
const Problem = db.getORM().models.problem;

const defaultTypeDefs = `
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
    setCurrentProjectSpeed(projectSpeed: ProjectSpeedInput!): Int
  }
  type Subscription {
    state: String!
  }
`;

const typeDefs = mergeTypes(
  [defaultTypeDefs, ticketSchemas, userSchemas, problemCategoriesSchemas],
  { all: true },
);

const defaultResolvers = {
  Mutation: {
    updateCurrentState: async (_, { state }, { pubsub, user }) => {
      const channel = 'user#' + user.id;
      pubsub.publish(channel, { state });
      await user.set('state', state);
      await user.save();
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
      await ticketToUpdate.update({
        estimatedTime: updatedEstimatedTime,
        realTime: updatedRealTime,
      });
      await taskToUpdate.update(task);
      await Problem.destroy({ where: { taskId: taskToUpdate.id } });
      if (task.problems) {
        for (let formattedProblem of task.problems) {
          formattedProblem.taskId = taskToUpdate.id;
          const problem = await Problem.create(formattedProblem);
          formattedProblem.problemCategory &&
            (await problem.setProblemCategory(formattedProblem.problemCategory.id));
          await problem.save();
        }
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

const resolvers = mergeResolvers([
  ticketResolvers,
  userResolvers,
  defaultResolvers,
  problemCategoriesResolvers,
]);

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
