const { GraphQLServer, PubSub } = require('graphql-yoga')
const bodyParser = require('body-parser');
const sequelize = require('./sequelize')
const { authenticationMiddleware, loginRoute } = require('./auth')

const typeDefs = `
  type Query {
    hello: String!
    currentUser: User
  }
  type User {
    id: String,
    fullName: String,
    trelloId: String,
    currentProject: Project,
  }
  type Project {
    id: Int
    name: String
    thirdPartyType: String
    thirdPartyId: String
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
  },
  Mutation: {
    updateCurrentState: (_, args, { pubsub }) => {
      pubsub.publish('iduser', { state: args.state });

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
      subscribe: (_, args, { pubsub }) => {
        const channel = 'iduser';
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

const pubsub = new PubSub()
const context = async ({ request }) => ({
  user: request ? request.user : undefined,
  pubsub,
})
const server = new GraphQLServer({ typeDefs, resolvers, context })
server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware)
server.express.post(`/login`, bodyParser.json(), loginRoute)
server.start(() => console.log('Server is running on localhost:4000'))
