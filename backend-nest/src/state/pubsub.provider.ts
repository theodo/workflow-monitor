import { PubSub } from 'graphql-subscriptions';

export const pubSubProvider = [
  {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  },
];
