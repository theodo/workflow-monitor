import { Injectable } from '@nestjs/common';
import { PubSub } from '../../shared/pubsub/pubsub';
import { publisher } from './publisher';

@Injectable()
export class PubsubService {
  // tslint:disable-next-line:variable-name
  private _pubSub: PubSub;

  constructor() {
    this._pubSub = new PubSub({
      publisher,
    });
  }

  async publish(triggerName: string, payload: any) {
    return await this._pubSub.publish(triggerName, payload);
  }
}
