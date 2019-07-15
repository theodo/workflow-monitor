import { APIGatewayProxyResult, Context as AWSLambdaContext } from 'aws-lambda';
import { WebSocketDisconnectEvent } from '../shared/type';
import { unsubcribeByConnection } from './unsubscriber';

export class WsDiconnectHandler {
  async handle(
    event: WebSocketDisconnectEvent,
    context: AWSLambdaContext,
  ): Promise<APIGatewayProxyResult | void> {
    const connectionId = event.requestContext.connectionId;

    await unsubcribeByConnection(connectionId);
    return;
  }
}
