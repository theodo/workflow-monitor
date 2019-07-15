import { makeExecutableSchema } from 'graphql-tools';
import { subscriber } from './subscriber';
import { PubSub } from '../shared/pubsub/pubsub';
import * as jwt from 'jsonwebtoken';

const pubsub = new PubSub({
  subscriber,
});

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
          // resolve is call by the eventProcessor for each subscribers when a state is publish
          return payload;
        },
        subscribe: (obj, args, context) => {
          const user = jwt.decode(context.JWT) as { id: string };
          return pubsub.asyncIterator(`states#${user.id}`, context);
        },
      },
    },
  } as any,
});
