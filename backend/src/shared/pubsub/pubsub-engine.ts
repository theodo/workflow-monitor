import { PubSubAsyncIterator } from './pubsub-async-iterator';

export abstract class PubSubEngine {
  public abstract publish(triggerName: string, payload: any): Promise<void>;
  public abstract subscribe(
    triggerName: string,
    onMessage: (...args: any[]) => void,
    options: { [key: string]: any },
  ): Promise<number>;
  public abstract unsubscribe(subId: number);
  public asyncIterator<T>(
    triggers: string | string[],
    subscriberOptions: { [key: string]: any } = {},
  ): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, triggers, subscriberOptions);
  }
}
