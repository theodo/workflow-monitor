import { makeExecutableSchema } from 'graphql-tools';
import { PubSub } from '../shared/pubsub/pubsub';

const pubsub = new PubSub();

export default makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      serverTime: Float!
    }

    type Subscription {
      state: String!
    }
  `,
  resolvers: {
    Subscription: {
      state: {
        subscribe: (obj, args, context) => pubsub.subscribe(`states#${context.userId}`, context),
      },
    },
  } as any,
});
