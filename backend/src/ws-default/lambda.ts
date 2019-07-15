import { Context as AWSLambdaContext, Handler } from 'aws-lambda';
import { WsEventHandler } from './ws-event-handler';
import gqlSchema from './graphql-schema';
import { WebSocketMessageEvent } from '../shared/type';

const wsHandler = new WsEventHandler(gqlSchema);

export const handler: Handler = (event: WebSocketMessageEvent, context: AWSLambdaContext) => {
  if (
    !event.requestContext ||
    !event.requestContext.routeKey ||
    event.requestContext.routeKey !== '$default'
  ) {
    throw new Error('Invalid event');
  }
  // event is web socket event from api gateway v2
  // tslint:disable-next-line:no-console
  console.log('ws', event.requestContext.routeKey);
  return wsHandler.handle(event, context);
};
