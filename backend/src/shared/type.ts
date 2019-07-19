import { APIGatewayEventRequestContext } from 'aws-lambda';

/**
 * Request context provided by AWS API Gateway V2 proxy event
 *
 * connectionId can be used to identify/terminate the connection to client
 * routeKey can be used to route event by specific parts of communication flow
 */
// @ts-ignore
export interface WebSocketRequestContext<MessageRouteKey> extends APIGatewayEventRequestContext {
  connectionId: string;
  domainName: string;
  routeKey: MessageRouteKey;
}

/**
 * The event invoked by AWS API Gateway V2 when message is received
 */
export interface WebSocketMessageEvent {
  body: string;
  requestContext: WebSocketRequestContext<'$default'>;
  apiGatewayUrl?: string;
  [key: string]: any;
}

/**
 * The event invoked by AWS API Gateway V2 when the web socket is disconnected
 */
export interface WebSocketDisconnectEvent {
  body: string;
  requestContext: WebSocketRequestContext<'$disconnect'>;
  apiGatewayUrl?: string;
}

/**
 * The event invoked by AWS API Gateway V2 when the web socket is disconnected
 */
export interface WebSocketConnectEvent {
  body: string;
  requestContext: WebSocketRequestContext<'$connect'>;
  apiGatewayUrl?: string;
}

export interface GraphQlOperationPayload {
  extensions: {};
  operationName: string;
  query: string;
  variables: {};
  Authorization?: string;
}

/**
 * The Operation provided by ApolloClient in WebSocketMessages
 */
export interface GraphQlOperation {
  type: string;
  payload: GraphQlOperationPayload;
  id: number;
}

/**
 * The Response send to ApolloClient in WebSocket
 */
export interface GraphQlResponse {
  type: string;
  payload?: {
    data?: { [key: string]: any };
    errors?: { [key: string]: any };
  };
  id?: number;
}

export interface WSSubscriptionContext {
  id: string;
  operationId: number;
  connectionId: string;
  connectionEndpoint: string;
  operation: string;
  triggerName?: string;
  JWT?: string;
}
