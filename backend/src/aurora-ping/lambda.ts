import { Handler } from 'aws-lambda';
import mysql from 'mysql2/promise';

const ping = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const query = `SHOW TABLES;`;
  try {
    await connection.query(query);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.stack);
    await connection.end();
    return {
      body: JSON.stringify({ error: err, message: `Fail to ping Aurora` }),
      statusCode: 500,
    };
  }
  await connection.end();
  // tslint:disable-next-line:no-console
  console.log('Aurora pinged !');
  return {
    body: JSON.stringify({
      message: 'Aurora pinged',
    }),
    statusCode: 200,
  };
};

export const handler: Handler = event => {
  return ping();
};
