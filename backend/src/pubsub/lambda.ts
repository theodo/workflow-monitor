import { Handler, SNSEvent } from 'aws-lambda';
import {
  APIGatewayWebSocketEvent,
  createWsHandler,
  DynamoDBConnectionManager,
  DynamoDBEventStore,
  DynamoDBSubscriptionManager,
  PubSub,
} from './aws-lambda-graphql-custom';
import { makeExecutableSchema } from 'graphql-tools';
import createSNSProcessor from './aws-lambda-graphql-custom/createSNSEventProcessor';

const eventStore = new DynamoDBEventStore();
const pubSub = new PubSub({ eventStore });

const schema = makeExecutableSchema({
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
        subscribe: pubSub.subscribe('states'),
      },
    },
  } as any,
});

const subscriptionManager = new DynamoDBSubscriptionManager({
  subscriptionsTableName: `${process.env.SERVICE_PREFIX}Subscriptions`,
});
const connectionManager = new DynamoDBConnectionManager({
  subscriptions: subscriptionManager,
  connectionsTable: `${process.env.SERVICE_PREFIX}Connections`,
});

const eventProcessor = createSNSProcessor({
  connectionManager,
  schema,
  subscriptionManager,
});

const wsHandler = createWsHandler({
  connectionManager,
  schema,
  subscriptionManager,
});

export const handler: Handler = (event: any, context) => {
  // console.log('pubsub event', event);
  const currentTime = new Date().getTime();
  // detect event type
  if (event.source === 'serverless-plugin-warmup') {
    // tslint:disable-next-line:no-console
    console.log('WarmUp - Lambda is warm!');
    return;
  }
  if ((event as SNSEvent).Records != null) {
    // event is DynamoDB stream event
    // tslint:disable-next-line:no-console
    console.log('SNS event');
    return eventProcessor(event, context, currentTime);
  }
  if (
    (event as APIGatewayWebSocketEvent).requestContext != null &&
    (event as APIGatewayWebSocketEvent).requestContext.routeKey != null
  ) {
    // event is web socket event from api gateway v2
    // tslint:disable-next-line:no-console
    console.log('ws', event.requestContext.routeKey);
    return wsHandler(event as APIGatewayWebSocketEvent, context);
  }
  throw new Error('Invalid event');
};
