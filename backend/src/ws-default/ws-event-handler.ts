import {
  GraphQlOperation,
  GraphQlResponse,
  WebSocketMessageEvent,
  WSSubscriptionContext,
} from '../shared/type';
import { APIGatewayProxyResult, Context as AWSLambdaContext } from 'aws-lambda';
import { execute, ExecutionArgs, getOperationAST, GraphQLSchema, parse, subscribe } from 'graphql';
import { extractEndpointFromEvent } from '../shared/utils/extract-endpoint-from-event';
import { sendToConnection } from '../shared/utils/send-message-to-connection';

export class WsEventHandler {
  private gqlSchema: GraphQLSchema;

  constructor(gqlSchema: GraphQLSchema) {
    this.gqlSchema = gqlSchema;
  }

  async handle(
    event: WebSocketMessageEvent,
    context: AWSLambdaContext,
  ): Promise<APIGatewayProxyResult | void> {
    const connectionId = event.requestContext.connectionId;
    const endpoint = extractEndpointFromEvent(event);
    const operation: GraphQlOperation = JSON.parse(event.body);

    let response: GraphQlResponse = null;
    let result: any;

    switch (operation.type) {
      case 'connection_init':
        response = { type: 'connection_ack' };
        await sendToConnection(connectionId, endpoint, JSON.stringify(response));
        break;
      case 'stop':
        response = { type: 'completed', id: operation.id, payload: null };
        await sendToConnection(connectionId, endpoint, JSON.stringify(response));
        break;
      case 'start':
        const document = parse(operation.payload.query);
        const JWT = operation.payload.Authorization;
        delete operation.payload.Authorization;
        const subscriptionContext: WSSubscriptionContext = {
          id: `${connectionId}:${operation.id}`,
          operationId: operation.id,
          connectionId,
          connectionEndpoint: endpoint,
          operation: JSON.stringify(operation.payload),
          JWT,
        };
        const executionArgs: ExecutionArgs = {
          schema: this.gqlSchema,
          document,
          contextValue: subscriptionContext,
          operationName: operation.payload.operationName,
          variableValues: operation.payload.variables,
        };
        const operationAST = getOperationAST(document, operation.payload.operationName || '');
        if (operationAST.operation === 'subscription') {
          result = await subscribe(executionArgs);
        } else {
          result = await execute(executionArgs);
        }

        if (result.next) {
          result.next();
        } else {
          response = { type: 'data', id: operation.id, payload: result };
          await sendToConnection(connectionId, endpoint, JSON.stringify(response));
        }
        break;
      default:
        response = {
          type: 'data',
          id: operation.id,
          payload: { errors: { message: 'Bad request type' } },
        };
        await sendToConnection(connectionId, endpoint, JSON.stringify(response));
    }

    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  }
}
