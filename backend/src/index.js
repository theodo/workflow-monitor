const fs = require('fs');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const bodyParser = require('body-parser');
const { sequelize } = require('../models');
const { formatFullTicket, formatTasks } = require('./formatters');
const {
  upsert,
  SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
  SELECT_DAILY_PERFORMANCE_HISTORY_QUERY,
} = require('./dbUtils');
const getAllocatedTimeFromPointsAndCelerity = require('./helpers');
const {
  authenticationMiddleware,
  loginRoute,
  websocketAuthenticationMiddleware,
} = require('./auth');

const isDev = process.env.NODE_ENV && process.env.NODE_ENV === 'development';

const Project = sequelize.models.project;
const ProblemCategory = sequelize.models.problemCategory;
const Ticket = sequelize.models.ticket;
const Task = sequelize.models.task;
const Problem = sequelize.models.problem;

const typeDefs = `
  type Query {
    hello: String!
    currentUser: User
    dailyPerformanceHistory(startDate: String, endDate: String): [DailyTicketPerformance]
    problemCategories: [ProblemCategory]
    problemCategoriesWithCount: [ProblemCategoryWithCount]
    tickets(pagination: PaginationInput): TicketList
    ticket(ticketId: Int): Ticket
  }
  type DailyTicketPerformance {
    creationDay: String,
    celerityFailedTicketsCount: Int,
    casprFailedTicketsCount: Int,
  }
  type User {
    id: String,
    fullName: String,
    trelloId: String,
    currentProject: Project,
    state: String,
  }
  type Project {
    id: Int
    name: String
    dailyDevelopmentTime: Int
    celerity: Int
    thirdPartyType: String
    thirdPartyId: String
  }
  type TicketList {
    count: Int
    rows: [Ticket]
  }
  type Ticket {
    id: Int
    createdAt: String
    description: String
    thirdPartyId: String
    complexity: Int
    status: String
    tasks: [Task]
    allocatedTime: Int
    realTime: Int
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
    saveTicket(state: String!): Int,
    updateTask(task: TaskInput!): Task,
    selectProject(project: ProjectInput): Project,
    addProblemCategory(problemCategoryDescription: String): ProblemCategory,
    setTicketThirdPartyId(ticketId: Int!, idShort: String!): Int
    setCurrentProjectSpeed(projectSpeed: ProjectSpeedInput!): Int
  }
  type Subscription {
    state: String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, args, { user }) => `Hello ${user.fullName || 'World'}`,
    currentUser: (_, args, { user }) => user,
    dailyPerformanceHistory: (_, { startDate, endDate }, { user }) => {
      const projectId = user.get('currentProjectId');
      return sequelize.query(SELECT_DAILY_PERFORMANCE_HISTORY_QUERY, {
        replacements: { projectId: projectId, startDate: startDate, endDate: endDate },
        type: sequelize.QueryTypes.SELECT,
      });
    },
    problemCategories: () => ProblemCategory.findAll(),
    problemCategoriesWithCount: (_, args, { user }) => {
      const projectId = user.currentProject.id;
      return sequelize.query(SELECT_PROBLEM_CATEGORY_COUNT_QUERY, {
        replacements: [projectId],
        type: sequelize.QueryTypes.SELECT,
      });
    },
    ticket: (_, { ticketId }) => {
      return Ticket.findById(ticketId, {
        include: {
          model: Task,
          as: 'tasks',
          include: {
            model: Problem,
            as: 'problems',
            include: {
              model: ProblemCategory,
              as: 'problemCategory',
            },
          },
        },
      });
    },
    tickets: (_, { pagination: { limit, offset } }, { user }) => {
      const project = user.get('currentProject');
      return Ticket.findAndCountAll({
        where: { projectId: project.id },
        limit,
        order: [['createdAt', 'DESC']],
        offset,
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
    saveTicket: async (_, { state }, { user }) => {
      const jsState = JSON.parse(state);

      const project = user.get('currentProject');
      const allocatedTime = getAllocatedTimeFromPointsAndCelerity(
        jsState.currentTrelloCard.ticketPoints,
        project.celerity,
        project.dailyDevelopmentTime,
      );
      const formattedTicket = formatFullTicket(jsState, project, user, allocatedTime);
      const ticket = await upsert(Ticket, formattedTicket, {
        thirdPartyId: formattedTicket.thirdPartyId,
      });
      const ticketId = ticket.id;
      Task.destroy({ where: { ticketId: ticket.id } });
      const formattedTasks = formatTasks(jsState, ticket);
      formattedTasks.map(async formattedTask => {
        const task = await Task.create(formattedTask);

        formattedTask.problems.map(async formattedProblem => {
          formattedProblem.taskId = task.id;
          const problem = Problem.create(formattedProblem);
          formattedProblem.problemCategory &&
            problem.setProblemCategory(formattedProblem.problemCategory.id);
          problem.save();
        });
      });
      return ticketId;
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
    setTicketThirdPartyId: async (_, { ticketId, idShort }) => {
      Ticket.update({ thirdPartyId: idShort }, { where: { id: ticketId } });
      return 1;
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

const pubsub = new PubSub();
const context = async ({ request, connection }) => ({
  user: request ? request.user : connection ? connection.context.user : undefined,
  pubsub,
});
const server = new GraphQLServer({ typeDefs, resolvers, context });
server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware);

const serverOptions = isDev
  ? { subscriptions: { onConnect: websocketAuthenticationMiddleware } }
  : {
      https: {
        cert: fs.readFileSync('/home/ubuntu/certificates/cert.pem', 'utf8'),
        key: fs.readFileSync('/home/ubuntu/certificates/privkey.pem', 'utf8'),
      },
      subscriptions: { onConnect: websocketAuthenticationMiddleware },
    };

server.express.post(`/login`, bodyParser.json(), loginRoute);
server.start(serverOptions, () => console.log('Server is running on localhost:4000'));
