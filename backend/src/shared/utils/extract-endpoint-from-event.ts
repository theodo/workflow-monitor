import { WebSocketMessageEvent } from '../../shared/type';

export function extractEndpointFromEvent(event: WebSocketMessageEvent): string {
  if (process.env.IS_OFFLINE) {
    return 'http://localhost:4001';
  }
  return `${event.requestContext.domainName}/${event.requestContext.stage}`;
}
