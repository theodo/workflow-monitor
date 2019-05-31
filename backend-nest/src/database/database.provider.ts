import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'postgresql',
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
