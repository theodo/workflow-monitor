import { mergeResolvers } from 'merge-graphql-schemas';

const { ticketResolvers } = require('./tickets');
const { userResolvers } = require('./users');

module.exports = mergeResolvers([ticketResolvers, userResolvers]);
