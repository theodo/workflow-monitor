const fs = require('fs');
const { GraphQLServer, PubSub } = require('graphql-yoga')
const bodyParser = require('body-parser');
const { sequelize } = require('../models');
const { formatFullTicket, formatTasks } = require('./formatters');
const { upsert, SELECT_PROBLEM_CATEGORY_COUNT_QUERY } = require('./dbUtils');
const { authenticationMiddleware, loginRoute, websocketAuthenticationMiddleware } = require('./auth')

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
    problemCategories: [ProblemCategory]
    problemCategoriesWithCount: [ProblemCategoryWithCount]
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
    thirdPartyType: String
    thirdPartyId: String
  }
  type ProblemCategory {
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
  type Mutation {
    updateCurrentState(state: String!): Int,
    selectProject(project: ProjectInput): Project,
    addProblemCategory(problemCategoryDescription: String): ProblemCategory,
  }
  type Subscription {
    state: String!
  }
`

const resolvers = {
  Query: {
    hello: (_, args, { user }) => `Hello ${user.fullName || 'World'}`,
    currentUser: (_, args, { user }) => user,
    problemCategories: () => ProblemCategory.findAll(),
    problemCategoriesWithCount: (_, args, { user }) => {
      const projectId = user.currentProject.id;
      return sequelize.query(
        SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
        { replacements: [projectId], type: sequelize.QueryTypes.SELECT }
      )
    },
  },
  Mutation: {
    updateCurrentState: (_, { state }, { pubsub, user }) => {
      const channel = 'user#'+user.id;
      pubsub.publish(channel, { state });
      user.set('state', state);
      user.save();

      jsState = JSON.parse(state);
      if (jsState.currentStep === 'RESULTS') {
        const project = user.get('currentProject');
        const formattedTicket = formatFullTicket(jsState, project, user);
        upsert(Ticket, formattedTicket, {thirdPartyId: formattedTicket.thirdPartyId})
          .then(ticket => {
            Task.destroy({ where: { ticketId: ticket.id}});
            const formattedTasks = formatTasks(jsState, ticket);
            formattedTasks.map((formattedTask) =>
              Task.create(formattedTask)
                .then(task => {
                  formattedTask.problems.map(formattedProblem => {
                    formattedProblem.taskId = task.id;
                    Problem.create(formattedProblem)
                      .then(problem => formattedProblem.problemCategory && problem.setProblemCategory(formattedProblem.problemCategory.id));
                  })
                })
            );
          });
      }

      return 1;
    },
    selectProject: (_, { project }, { user }) => {
      project.thirdPartyType = 'TRELLO';
      return Project.findOrCreate({
        where: {thirdPartyId: project.thirdPartyId},
        defaults: {...project}
      })
      .spread((project) => {
        user.setCurrentProject(project.id);
        return project;
      });
    },
    addProblemCategory: (_, { problemCategoryDescription }, { user }) => {
      return ProblemCategory.create({
        description: problemCategoryDescription,
      });
    },
  },
  Subscription: {
    state: {
      subscribe: (_, args, { user }) => {
        const channel = 'user#' + user.id;
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

const pubsub = new PubSub()
const context = async ({ request, connection }) => ({
  user: request ? request.user : connection ? connection.context.user : undefined,
  pubsub,
});
const server = new GraphQLServer({ typeDefs, resolvers, context })
server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware)

const serverOptions = isDev ?
  {subscriptions : {onConnect: websocketAuthenticationMiddleware}} :
  {
  https:{
    cert: fs.readFileSync('/home/ubuntu/certificates/cert.pem','utf8'),
    key: fs.readFileSync('/home/ubuntu/certificates/privkey.pem','utf8'),
  },
  subscriptions : {onConnect: websocketAuthenticationMiddleware}}

server.express.post(`/login`, bodyParser.json(), loginRoute)
server.start(serverOptions,() => console.log('Server is running on localhost:4000'))
