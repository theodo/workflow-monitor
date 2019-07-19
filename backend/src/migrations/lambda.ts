import { Handler } from 'aws-lambda';
import Umzug from 'umzug';
import configObject from '../../config/config.json';
import { Sequelize } from 'sequelize-typescript';

const env = process.env.NODE_ENV;
const config = configObject[env];

const sequelize = new Sequelize({
  dialect: config.dialect,
  host: env === 'development' ? 'postgresql' : config.host,
  port: 5432,
  username: config.username,
  password: config.password,
  database: config.database,
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

export const handler: Handler = () => {
  return migrate();
};
