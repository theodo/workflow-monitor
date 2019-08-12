import { GraphQlResponse, WSSubscriptionContext } from '../type';
import { sendToConnection } from '../utils/send-message-to-connection';
import { formatGraphQlSubscriptionPayload } from '../utils/format-graphql-subscription-payload';
import mysql from 'mysql2/promise';

export const publisher = async (triggerName: string, payload: any): Promise<void> => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const query = `
    SELECT \`id\`, \`operationId\`, \`connectionId\`, \`connectionEndpoint\`, \`operation\`, \`triggerName\`
    FROM \`${process.env.DB_NAME}\`.\`subscription\`
    WHERE \`triggerName\` = ?
    `;
  const values = [triggerName];

  let subscriptions: WSSubscriptionContext[] = [];
  try {
    const [rows, fields] = await connection.execute(query, values);
    subscriptions = rows as WSSubscriptionContext[];
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
    throw Error('Fail to load subscriptions');
  }
  await connection.end();

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
