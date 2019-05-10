const resolvers = require('./resolvers');
const schemas = require('./schemas');
const DAO = require('./db');

module.exports = {
  userResolvers: resolvers,
  userSchemas: schemas,
  userDAO: DAO,
};
