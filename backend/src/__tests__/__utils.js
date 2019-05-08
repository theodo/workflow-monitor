const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { server, serverOptions } = require('../');
const { execute, toPromise } = require('apollo-link');

module.exports.toPromise = toPromise;

// Simulate a client server
const startTestServer = async (headers = {}) => {
  const link = new HttpLink({
    uri: `http://localhost:${4000 + parseInt(process.env.JEST_WORKER_ID)}`, // Use one port per Jest worker to allow parallel testing
    fetch,
    headers,
  });

  const executeOperation = ({ query, variables = {} }) => execute(link, { query, variables });

  return {
    link,
    graphql: executeOperation,
  };
};

module.exports.startTestServer = startTestServer;

// Launch an instance of our server with different options for test purposes (port)
const launchAPIServer = async () => {
  const port = 4000 + parseInt(process.env.JEST_WORKER_ID); // Use one port per Jest worker to allow parallel testing
  return await server.start({ ...serverOptions, port });
};

module.exports.launchAPIServer = launchAPIServer;
