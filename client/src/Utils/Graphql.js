import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';

const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.statusCode === 403) {
    localStorage.clear();
    window.location.hash = '#/login'; // REFACTO needed to change the redirection method
  }
});

const link = createHttpLink({
  uri: '/api/',
});

const httpLink = errorLink.concat(link);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwt_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authentication: token ? `Bearer ${token}` : '',
    },
  };
});

export const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const dev = process.env.NODE_ENV && process.env.NODE_ENV === 'development';
const WS_API_URL = dev ? 'ws://localhost:4000/' : `wss://${window.location.hostname}/api/`;

const wsLink = new WebSocketLink({
  uri: WS_API_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('jwt_token'),
    },
  },
});

export const subscriptionClient = new ApolloClient({
  link: authLink.concat(wsLink),
  cache: new InMemoryCache(),
});
