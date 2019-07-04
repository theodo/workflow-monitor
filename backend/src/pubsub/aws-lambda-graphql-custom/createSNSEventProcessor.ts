import { Context, SNSEvent } from 'aws-lambda';
import { ExecutionResult, GraphQLSchema } from 'graphql';
import { createAsyncIterator, getAsyncIterator, isAsyncIterable } from 'iterall';
import { formatMessage } from './formatMessage';
import { execute } from './execute';
import { IConnectionManager, ISubscriptionEvent, ISubscriptionManager } from './types';
import { extractISubscriptionEventFromSNSMessage } from './helpers/extractISubscriptionEventFromSNSMessage';

interface Options {
  connectionManager: IConnectionManager;
  schema: GraphQLSchema;
  subscriptionManager: ISubscriptionManager;
}

class PubSub {
  private events: ISubscriptionEvent[];

  constructor(events: ISubscriptionEvent[]) {
    this.events = events;
  }

  asyncIterator(eventNames: string | string[]) {
    const names = Array.isArray(eventNames) ? eventNames : [eventNames];

    return createAsyncIterator(
      this.events.filter(event => names.includes(event.event)).map(event => event.payload),
    );
  }
}

// polyfill Symbol.asyncIterator
if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for('asyncIterator');
}

function createSNSProcessor({ connectionManager, schema, subscriptionManager }: Options) {
  return async function processSNSEvents(
    { Records }: SNSEvent,
    context: Context,
    receptionTime: number,
  ) {
    for (const record of Records) {
      // process only Notification events
      if (record.Sns.Type !== 'Notification') {
        continue;
      }

      // now construct event from dynamodb image
      const event: ISubscriptionEvent = extractISubscriptionEventFromSNSMessage(record.Sns);
      // iterate over subscribers that listen to this event
      // and for each connection:
      //  - create a schema (so we have subscribers registered in PubSub)
      //  - execute operation from event againt schema
      //  - if iterator returns a result, send it to client
      //  - clean up subscriptions and follow with next page of subscriptions
      //  - if the are no more subscriptions, process next event
      // make sure that you won't throw any errors otherwise dynamo will call
      // handler with same events again
      for await (const subscribers of subscriptionManager.subscribersByEventName(event.event)) {
        const promises = subscribers
          .map(async subscriber => {
            // create PubSub for this subscriber
            const pubSub = new PubSub([event]);

            // execute operation by executing it and then publishing the event
            const iterable = await execute({
              connectionManager,
              subscriptionManager,
              schema,
              event: {} as any, // we don't have an API GW event here
              connection: subscriber.connection,
              operation: subscriber.operation,
              pubSub: pubSub as any,
              registerSubscriptions: false,
              useSubscriptions: true,
            });

            if (!isAsyncIterable(iterable)) {
              // something went wrong, probably there is an error
              return Promise.resolve();
            }

            const iterator = getAsyncIterator(iterable);
            const result: IteratorResult<ExecutionResult> = await iterator.next();

            if (
              result.value.data &&
              result.value.data.subscribeDeletedStates &&
              result.value.data.subscribeDeletedStates.perfLog
            ) {
              result.value.data.subscribeDeletedStates.perfLog.push({
                key: 'publish_to_pubSub_lambda',
                timestamp: receptionTime - 1561700000000,
              });
              result.value.data.subscribeDeletedStates.perfLog.push({
                key: 'format_response',
                timestamp: new Date().getTime() - 1561700000000,
              });
            }
            if (
              result.value.data &&
              result.value.data.subscribeStates &&
              result.value.data.subscribeStates.perfLog
            ) {
              result.value.data.subscribeStates.perfLog.push({
                key: 'publish_to_pubSub_lambda',
                timestamp: receptionTime - 1561700000000,
              });
              result.value.data.subscribeStates.perfLog.push({
                key: 'format_response',
                timestamp: new Date().getTime() - 1561700000000,
              });
            }

            if (result.value != null) {
              return connectionManager.sendToConnection(
                subscriber.connection,
                formatMessage({
                  id: subscriber.operationId,
                  payload: result.value,
                  type: 'GQL_OP_RESULT',
                }),
              );
            }

            return Promise.resolve();
          })
          // tslint:disable-next-line:no-console
          .map(promise => promise.catch(e => console.log(e)));

        await Promise.all(promises);
      }
    }
  };
}

export { createSNSProcessor };
export default createSNSProcessor;
