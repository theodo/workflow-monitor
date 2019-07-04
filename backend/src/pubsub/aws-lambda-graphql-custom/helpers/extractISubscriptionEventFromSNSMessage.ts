import { ISubscriptionEvent } from '../types';
import { SNSMessage } from 'aws-lambda';

export function extractISubscriptionEventFromSNSMessage(event: SNSMessage): ISubscriptionEvent {
  const { topic, payload } = JSON.parse(event.Message);
  return {
    event: topic,
    payload,
  };
}
