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
import { isAsyncIterable } from 'iterall';
import jwt from 'jsonwebtoken';

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
        let decodedJWT;
        try {
          decodedJWT = jwt.verify(operation.payload.Authorization, process.env.JWT_SECRET) as {
            id: number;
          };
        } catch (e) {
          throw new Error('Invalid auth token!');
        }
        if (!decodedJWT.id) {
          throw new Error('Invalid auth token!');
        }
        const userId = decodedJWT.id;
        delete operation.payload.Authorization;
        const subscriptionContext: WSSubscriptionContext = {
          id: `${connectionId}:${operation.id}`,
          operationId: operation.id,
          connectionId,
          connectionEndpoint: endpoint,
          operation: JSON.stringify(operation.payload),
          userId,
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

        // subscribe(executionArgs) return an AsyncIterable if the subscription is successful
        // It check if the subscription had an error or if it was an execution
        if (!isAsyncIterable(result)) {
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
