import { WSSubscriptionContext } from '../type';
import { createAsyncIterator } from 'iterall';
import mysql from 'mysql2/promise';

export const subscriber = async (
  triggerName: string,
  options: WSSubscriptionContext,
): Promise<AsyncIterator<any>> => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const query = `
    INSERT INTO \`${process.env.DB_NAME}\`.\`subscription\`
    (\`id\`, \`operationId\`, \`connectionId\`, \`connectionEndpoint\`, \`operation\`, \`triggerName\`)
    VALUES(?, ?, ?, ?, ?, ?)
    `;
  const values = [
    options.id,
    options.operationId,
    options.connectionId,
    options.connectionEndpoint,
    options.operation,
    triggerName,
  ];

  try {
    await connection.execute(query, values);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
  }
  await connection.end();
  return Promise.resolve(createAsyncIterator([]));
};
