const resolvers = require('./resolvers');
const schemas = require('./schemas');
const DAO = require('./dao');

module.exports = {
  userResolvers: resolvers,
  userSchemas: schemas,
  userDAO: DAO,
};
