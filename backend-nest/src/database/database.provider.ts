import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Task } from 'src/task/task.entity';
import { Ticket } from 'src/ticket/ticket.entity';

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
      sequelize.addModels([User, Task, Ticket]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
