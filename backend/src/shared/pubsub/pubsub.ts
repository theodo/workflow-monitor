import { createAsyncIterator } from 'iterall';

export interface PubSubOptions {
  publisher?: (triggerName: string, payload: any) => Promise<void>;
  subscriber?: (
    triggerName: string,
    options: { [key: string]: any },
  ) => Promise<AsyncIterator<any>>;
  unsubscriber?: (connectionId: number) => Promise<void>;
}

export class PubSub {
  private customPublish: (triggerName: string, payload: any) => Promise<void>;
  private customSubscribe: (
    triggerName: string,
    options: { [key: string]: any },
  ) => Promise<AsyncIterator<any>>;
  private customUnsubscribe: (connectionId: number) => Promise<void>;

  constructor(options: PubSubOptions = {}) {
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
    options: { [key: string]: any },
  ): Promise<AsyncIterator<any>> {
    if (this.customSubscribe) {
      return this.customSubscribe(triggerName, options);
    }

    return Promise.resolve(createAsyncIterator([]));
  }

  public unsubscribe(connectionId: number): Promise<void> {
    if (this.customUnsubscribe) {
      return this.customUnsubscribe(connectionId);
    } else {
      return;
    }
  }
}
