const resolvers = require('./resolvers');
const schemas = require('./schemas');
const DB = require('./db');

module.exports = {
  userResolvers: resolvers,
  userSchemas: schemas,
  userDB: DB,
};
