import { Client } from 'pg';
import configObject from '../../config/config.json';
import { WSSubscriptionContext } from '../shared/type';

const env = process.env.NODE_ENV;
const config = configObject[env];

export const subscriber = async (
  triggerName: string,
  onMessage: (...args: any[]) => void,
  options: WSSubscriptionContext,
): Promise<number> => {
  const client = new Client({
    host: env === 'development' ? 'postgresql' : config.host,
    port: 5432,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  await client.connect();

  const query = {
    text:
      'INSERT INTO subscription.subscription ("id", "operationId", "connectionId", "connectionEndpoint", "operation", "triggerName") ' +
      'VALUES($1, $2, $3, $4, $5, $6)',
    values: [
      options.id,
      options.operationId,
      options.connectionId,
      options.connectionEndpoint,
      options.operation,
      triggerName,
    ],
  };

  try {
    await client.query(query);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
  }
  return 1;
};
