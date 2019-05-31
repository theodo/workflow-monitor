import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'caspr',
        password: 'caspr',
        database: 'caspr',
      });
      sequelize.addModels([User]);
      return sequelize;
    },
  },
];
