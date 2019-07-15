import { EventEmitter } from 'events';
import { PubSubEngine } from './pubsub-engine';
import { ResolverFn } from './with-filter';
import { createAsyncIterator } from 'iterall';

export interface PubSubOptions {
  publisher?: (triggerName: string, payload: any) => Promise<void>;
  subscriber?: (
    triggerName: string,
    onMessage: (...args: any[]) => void,
    options: { [key: string]: any },
  ) => Promise<number>;
  unsubscriber?: (subId: number) => any;
}

export class PubSub extends PubSubEngine {
  private customPublish: (triggerName: string, payload: any) => Promise<void>;
  private customSubscribe: (
    triggerName: string,
    onMessage: (...args: any[]) => void,
    options: { [key: string]: any },
  ) => Promise<number>;
  private customUnsubscribe: (subId: number) => any;

  constructor(options: PubSubOptions = {}) {
    super();
    this.customPublish = options.publisher;
    this.customSubscribe = options.subscriber;
    this.customUnsubscribe = options.unsubscriber;
  }

  public publish(triggerName: string, payload: any): Promise<void> {
    if (this.customPublish) {
      return this.customPublish(triggerName, payload);
    }
    return Promise.resolve();
  }

  public subscribe(
    triggerName: string,
    onMessage: (...args: any[]) => void,
    options: { [key: string]: any },
  ): Promise<number> {
    if (this.customSubscribe) {
      return this.customSubscribe(triggerName, onMessage, options);
    }

    return Promise.resolve(1);
  }

  public unsubscribe(subId: number) {
    if (this.customUnsubscribe) {
      this.customUnsubscribe(subId);
    }
  }
}
