import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Project } from '../project/project.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';
import { DefaultTask } from '../defaultTask/defaultTask.entity';
import { Problem } from '../problem/problem.entity';
import { DefaultTasksList } from '../defaultTasksList/defaultTasksList.entity';

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
      await sequelize.sync();
      return sequelize;
    },
  },
];
