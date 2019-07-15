import { Context as AWSLambdaContext, Handler } from 'aws-lambda';
import { WsDiconnectHandler } from './ws-diconnect-handler';
import { WebSocketDisconnectEvent } from '../shared/type';

const wsHandler = new WsDiconnectHandler();

export const handler: Handler = (event: WebSocketDisconnectEvent, context: AWSLambdaContext) => {
  if (
    !event.requestContext ||
    !event.requestContext.routeKey ||
    event.requestContext.routeKey !== '$disconnect'
  ) {
    throw new Error('Invalid event');
  }
  // event is web socket event from api gateway v2
  // tslint:disable-next-line:no-console
  console.log('ws', event.requestContext.routeKey);
  return wsHandler.handle(event, context);
};
