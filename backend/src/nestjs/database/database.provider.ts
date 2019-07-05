import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Project } from '../project/project.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';
import { DefaultTask } from '../defaultTask/defaultTask.entity';
import { Problem } from '../problem/problem.entity';
import { DefaultTasksList } from '../defaultTasksList/defaultTasksList.entity';
import configObject from '../../../config/config.json';

const env = process.env.NODE_ENV;
const config = configObject[env];

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: config.dialect,
        host: env === 'development' ? 'postgresql' : config.host,
        port: 5432,
        username: config.username,
        password: config.password,
        database: config.database,
      });
      sequelize.addModels([
        User,
        Task,
        Ticket,
        Project,
        ProblemCategory,
        DefaultTask,
        DefaultTasksList,
        Problem,
      ]);
      return sequelize;
    },
  },
];
