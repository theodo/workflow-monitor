const { GraphQLServer } = require('graphql-yoga')
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
    fullName: String
    trelloId: String
  }
`

const resolvers = {
  Query: {
    hello: (_, args, context) => `Hello ${context.user.fullName || 'World'}`,
    currentUser: (_, args, context) => context.user,
  },
}

const context = async ({ request }) => ({
  user: request.user,
})

const server = new GraphQLServer({ typeDefs, resolvers, context })
server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware)
server.express.post(`/login`, bodyParser.json(), loginRoute)
server.start(() => console.log('Server is running on localhost:4000'))
