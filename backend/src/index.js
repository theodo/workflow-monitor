const fs = require('fs');
const { GraphQLServer, PubSub } = require('graphql-yoga')
const bodyParser = require('body-parser');
const sequelize = require('./sequelize')
const { saveSessionToSkillpool } = require('./skillpool');
const { formatFullTicket, formatTasks } = require('./formatters');
const { upsert } = require('./dbUtils');
const { authenticationMiddleware, loginRoute, websocketAuthenticationMiddleware } = require('./auth')

const isDev = process.env.ENV && process.env.ENV === 'DEV';

const typeDefs = `
  type Query {
    hello: String!
    currentUser: User
    problemCategories: [ProblemCategory]
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
  input ProjectInput {
    name: String
    thirdPartyId: String
  }
  type Mutation {
    updateCurrentState(state: String!): Int,
    selectProject(project: ProjectInput): Project,
  }
  type Subscription {
    state: String!
  }
`

const resolvers = {
  Query: {
    hello: (_, args, { user }) => `Hello ${user.fullName || 'World'}`,
    currentUser: (_, args, { user }) => user,
    problemCategories: () => sequelize.models.problemCategory.findAll(),
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
        saveSessionToSkillpool(project, user, jsState);

        const formattedTicket = formatFullTicket(jsState, project, user);
        upsert(sequelize.models.ticket, formattedTicket, {thirdPartyId: formattedTicket.thirdPartyId})
          .then(ticket => {
            sequelize.models.task.destroy({ where: { ticketId: ticket.id}});
            const formattedTasks = formatTasks(jsState, ticket);
            sequelize.models.task.bulkCreate(formattedTasks);
          });
      }

      return 1;
    },
    selectProject: (_, { project }, { user }) => {
      return sequelize.models.project.findOrCreate({
        where: {thirdPartyId: project.thirdPartyId},
        defaults: {...project}
      })
      .spread((project) => {
        user.setCurrentProject(project);
        return project;
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
    cert: fs.readFileSync('/etc/letsencrypt/live/caspr.theo.do/cert.pem','utf8'),
    key: fs.readFileSync('/etc/letsencrypt/live/caspr.theo.do/privkey.pem','utf8'),
  },
  subscriptions : {onConnect: websocketAuthenticationMiddleware}}

server.express.post(`/login`, bodyParser.json(), loginRoute)
server.start(serverOptions,() => console.log('Server is running on localhost:4000'))
