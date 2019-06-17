const { env, DEV } = require('./main.js');

const { ApolloClient } = require('apollo-client');
const ws = require('ws');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { WebSocketLink } = require('apollo-link-ws');
const gql = require('graphql-tag');
const { setContext } = require('apollo-link-context');
const fetch = require('node-fetch');
const { getToken } = require('./auth.js');

const HTTP_API_URL =
  env === DEV
    ? 'http://localhost:4000/graphql'
    : 'https://caspr.theo.do/api/graphql';
const WS_API_URL =
  env === DEV
    ? 'ws://localhost:4000/graphql'
    : 'wss://caspr.theo.do/api/graphql';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink = new WebSocketLink({
  uri: WS_API_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getToken(),
    },
  },
  webSocketImpl: ws,
});

const httpLink = createHttpLink({
  uri: HTTP_API_URL,
  fetch,
});

const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const subscriptionClient = new ApolloClient({
  link: authLink.concat(wsLink),
  cache: new InMemoryCache(),
});

const stateSubscription = subscriptionClient.subscribe(
  {
    query: gql`
      subscription {
        state
      }
    `,
    variables: {},
  },
  () => console.log('error'),
);

module.exports = { stateSubscription, gqlClient };
