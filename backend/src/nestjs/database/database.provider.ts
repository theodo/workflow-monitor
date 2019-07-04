import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Project } from '../project/project.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';
import { DefaultTask } from '../defaultTask/defaultTask.entity';
import { Problem } from '../problem/problem.entity';
import { DefaultTasksList } from '../defaultTasksList/defaultTasksList.entity';

const env = process.env.NODE_ENV || 'production';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: env === 'development' ? 'postgresql' : process.env.DB_HOST,
        port: 5432,
        username: env === 'development' ? 'caspr' : process.env.DB_USER,
        password: env === 'development' ? 'caspr' : process.env.DB_PASSWORD,
        database: env === 'development' ? 'caspr' : `${process.env.SERVICE_PREFIX}DataBase`,
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
