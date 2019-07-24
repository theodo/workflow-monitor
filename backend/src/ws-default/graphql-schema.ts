import { makeExecutableSchema } from 'graphql-tools';
import { PubSub } from '../shared/pubsub/pubsub';
import * as jwt from 'jsonwebtoken';

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
    Query: {
      serverTime: () => Date.now(),
    },
    Subscription: {
      state: {
        resolve: (payload: string) => {
          // resolve is call by the publisher for each subscribers when a state is publish
          return payload;
        },
        subscribe: (obj, args, context) => {
          const user = jwt.decode(context.JWT) as { id: string };
          return pubsub.subscribe(`states#${user.id}`, context);
        },
      },
    },
  } as any,
});
