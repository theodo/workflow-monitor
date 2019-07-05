import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';

@Injectable()
export class PubsubService {
  // tslint:disable-next-line:variable-name
  private _pubSub;

  constructor() {
    this._pubSub = process.env.IS_OFFLINE
      ? new SNS({
          endpoint: 'http://127.0.0.1:4002',
          region: process.env.REGION,
        })
      : new SNS();
  }

  async publish(topic: string, payload: any) {
    try {
      await this._pubSub
        .publish({
          Message: JSON.stringify({ topic, payload }),
          TopicArn: `arn:aws:sns:${process.env.REGION}:${
            process.env.IS_OFFLINE ? 123456789012 : process.env.ACCOUNT_ID
          }:${process.env.NODE_ENV}${process.env.SERVICE_PREFIX}States`,
        })
        .promise();
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log('ERROR', e);
    }
    return;
  }
}
