import { Handler } from 'aws-lambda';
import Umzug from 'umzug';
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
  migrations: {
    path: './migrations',
    params: [sequelize.getQueryInterface(), Sequelize],
  },
});

const migrate = async () => {
  try {
    // tslint:disable-next-line:no-console
    console.log('ExecutingMigrations...');
    const executedMigrations = await umzug.up();
    // tslint:disable-next-line:no-console
    console.log('ExecutedMigrations:', executedMigrations);
    return {
      body: JSON.stringify({
        executedMigrations: executedMigrations.map(executedMigration => executedMigration.path),
      }),
      statusCode: 200,
    };
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('Error', e);
    return {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};

const revert = async () => {
  try {
    // tslint:disable-next-line:no-console
    console.log('Reverting...');
    const revertedMigrations = await umzug.down();
    // tslint:disable-next-line:no-console
    console.log('RevertedMigrations:', revertedMigrations);
    return {
      body: JSON.stringify({
        revertedMigrations: revertedMigrations.map(executedMigration => executedMigration.path),
      }),
      statusCode: 200,
    };
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('Error', e);
    return {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};

export const handler: Handler = event => {
  const body = JSON.parse(event.body);
  if (body.action === 'migrate') {
    return migrate();
  } else if (body.action === 'down') {
    return revert();
  } else {
    return Promise.resolve({
      body: JSON.stringify('Bad request'),
      statusCode: 400,
    });
  }
};
