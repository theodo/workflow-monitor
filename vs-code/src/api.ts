const { ApolloClient } = require('apollo-client');
const ws = require('ws');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { WebSocketLink } = require('apollo-link-ws');
const gql = require('graphql-tag');
const { setContext } = require('apollo-link-context');
const fetch = require('node-fetch');
const { getToken } = require('./auth');

const dev = false;
const HTTP_API_URL = dev ? 'http://localhost:4000/' : 'https://caspr.theo.do/api/';
const WS_API_URL = dev ? 'ws://localhost:4000/' : 'wss://caspr.theo.do/api/';

const authLink = setContext((_:any, { headers }: any) => {
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

export const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const subscriptionClient = new ApolloClient({
  link: authLink.concat(wsLink),
  cache: new InMemoryCache(),
});

export const stateSubscription = subscriptionClient.subscribe({
  query: gql`
  subscription {
    state
  }`,
  variables: {}
},() => console.log('error'));