import mysql from 'mysql2/promise';

export const unsubscriber = async (connectionId: string): Promise<void> => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const query = `DELETE FROM \`${process.env.DB_NAME}\`.\`subscription\` WHERE \`connectionId\` = ? `;
  const values = [connectionId];

  try {
    await connection.execute(query, values);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
    throw Error('Fail to load subscriptions');
  }
  await connection.end();
  return;
};
