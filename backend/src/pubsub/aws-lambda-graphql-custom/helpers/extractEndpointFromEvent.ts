import { APIGatewayWebSocketEvent } from '../types';

export function extractEndpointFromEvent(event: APIGatewayWebSocketEvent): string {
  if (event.apiGatewayUrl) {
    return event.apiGatewayUrl;
  }
  return `${event.requestContext.domainName}/${event.requestContext.stage}`;
}
