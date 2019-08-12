import { subscriber as defaultSubscriber } from './subscriber';
import { publisher as defaultPublisher } from './publisher';
import { unsubscriber as defaultUnsubscriber } from './unsubscriber';

export interface PubSubOptions {
  publisher?: (triggerName: string, payload: any) => Promise<void>;
  subscriber?: (triggerName: string, options: any) => Promise<AsyncIterator<any>>;
  unsubscriber?: (connectionId: string) => Promise<void>;
}

export class PubSub {
  private customPublish: (triggerName: string, payload: any) => Promise<void>;
  private customSubscribe: (triggerName: string, options: any) => Promise<AsyncIterator<any>>;
  private customUnsubscribe: (connectionId: string) => Promise<void>;

  constructor(options: PubSubOptions = {}) {
    this.customPublish = options.publisher;
    this.customSubscribe = options.subscriber;
    this.customUnsubscribe = options.unsubscriber;
  }

  public publish(triggerName: string, payload: any): Promise<void> {
    if (this.customPublish) {
      return this.customPublish(triggerName, payload);
    }
    return defaultPublisher(triggerName, payload);
  }

  public subscribe(triggerName: string, options: any): Promise<AsyncIterator<any>> {
    if (this.customSubscribe) {
      return this.customSubscribe(triggerName, options);
    }

    return defaultSubscriber(triggerName, options);
  }

  public unsubscribe(connectionId: string): Promise<void> {
    if (this.customUnsubscribe) {
      return this.customUnsubscribe(connectionId);
    } else {
      return defaultUnsubscriber(connectionId);
    }
  }
}
