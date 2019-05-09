const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { execute, toPromise } = require('apollo-link');
const auth = require('./auth');

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

// Launch an instance of our server with different options for test purposes (port)
const launchAPIServer = async () => {
  let { server, serverOptions } = require('./server'); // Import server within function to allow the auth middlewares to be mocked
  const port = 4000 + parseInt(process.env.JEST_WORKER_ID); // Use one port per Jest worker to allow parallel testing
  return await server.start({ ...serverOptions, port });
};

const mockAuthenticationMiddleware = userMock => {
  auth.authenticationMiddleware = jest.fn((req, res, next) => {
    req.user = userMock;
    next();
  });
  auth.websocketAuthenticationMiddleware = jest.fn(() => Promise.resolve(userMock));
};

module.exports = { toPromise, launchAPIServer, startTestServer, mockAuthenticationMiddleware };
