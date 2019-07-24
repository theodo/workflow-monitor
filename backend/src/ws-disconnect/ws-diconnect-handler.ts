import { APIGatewayProxyResult, Context as AWSLambdaContext } from 'aws-lambda';
import { WebSocketDisconnectEvent } from '../shared/type';
import { PubSub } from '../shared/pubsub/pubsub';

export class WsDiconnectHandler {
  async handle(
    event: WebSocketDisconnectEvent,
    context: AWSLambdaContext,
  ): Promise<APIGatewayProxyResult | void> {
    const connectionId = event.requestContext.connectionId;
    const pubsub = new PubSub();
    await pubsub.unsubscribe(connectionId);
    return;
  }
}
