import { Client } from 'pg';
import configObject from '../../../config/config.json';
import { GraphQlResponse, WSSubscriptionContext } from '../../shared/type';
import { sendToConnection } from '../../shared/utils/send-message-to-connection';
import { formatGraphQlSubscriptionPayload } from '../../shared/utils/format-graphql-subscription-payload';

const env = process.env.NODE_ENV;
const config = configObject[env];

export const publisher = async (triggerName: string, payload: any): Promise<void> => {
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
      'SELECT "id", "operationId", "connectionId", "connectionEndpoint", "operation", "triggerName" ' +
      'FROM subscription.subscription ' +
      'WHERE "triggerName" = $1 ',
    values: [triggerName],
  };
  let subscriptions: WSSubscriptionContext[] = [];
  try {
    const result = await client.query(query);
    subscriptions = result.rows;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
    throw Error('Fail to load subscriptions');
  }

  const promises = subscriptions.map(async subscription => {
    const operation = JSON.parse(subscription.operation);

    const messagePayload = formatGraphQlSubscriptionPayload(payload, operation);

    const message: GraphQlResponse = {
      id: subscription.operationId,
      payload: messagePayload,
      type: 'data',
    };

    await sendToConnection(
      subscription.connectionId,
      subscription.connectionEndpoint,
      JSON.stringify(message),
    );
  });

  await Promise.all(promises);
  return;
};
