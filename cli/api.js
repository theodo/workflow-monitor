const { ApolloClient } = require('apollo-client');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { WebSocketLink } = require('apollo-link-ws');
const gql = require('graphql-tag');
const { setContext } = require('apollo-link-context');

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true
  },
  webSocketImpl: ws
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ0cmVsbG9JZCI6IjU5NWE3ZDk1MDQ0Njk5YjRmYmI3OWMyYyIsImlhdCI6MTUzNjg2NTMyOX0.jiSBsO35Boq6k_yXTY_fu9kdboQm8pHtgwb0594OxbQ';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authentication: token ? `Bearer ${token}` : '',
    }
  };
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: authLink.concat(wsLink),
  cache,
});

const stateSubscription = apolloClient.subscribe({
  query: gql`
  subscription {
    state
  }`,
  variables: {}
});

module.exports = stateSubscription
