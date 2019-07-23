import { Client } from 'pg';
import configObject from '../../config/config.json';

const env = process.env.NODE_ENV;
const config = configObject[env];

export const unsubcribeByConnection = async (connectionId: string): Promise<void> => {
  const client = new Client({
    host: env === 'development' ? 'postgresql' : config.host,
    port: 5432,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  await client.connect();

  const query = {
    text: 'DELETE FROM subscription.subscription WHERE "connectionId" = $1 ',
    values: [connectionId],
  };

  try {
    await client.query(query);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
  }
  await client.end();
  return;
};
