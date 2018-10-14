const { ApolloClient } = require('apollo-client');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { WebSocketLink } = require('apollo-link-ws');
const gql = require('graphql-tag');
const { setContext } = require('apollo-link-context');
const fetch = require('node-fetch');
const { getToken } = require('./auth')

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authentication: token ? `Bearer ${token}` : '',
    }
  };
});

const wsLink = new WebSocketLink({
  uri: `ws://caspr.theo.do:4000/`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getToken(),
    },
  },
  webSocketImpl: ws,
});

const httpLink = createHttpLink({
  uri: 'http://caspr.theo.do/api/',
  fetch,
});

const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const subscriptionClient = new ApolloClient({
  link: authLink.concat(wsLink),
  cache: new InMemoryCache(),
});

const stateSubscription = subscriptionClient.subscribe({
  query: gql`
  subscription {
    state
  }`,
  variables: {}
});

module.exports = { stateSubscription, gqlClient }
