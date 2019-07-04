import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from '../database/database.module';
import { TicketModule } from '../ticket/ticket.module';
import { DefaultTaskModule } from '../defaultTask/defaultTask.module';
import { ProblemCategoryModule } from '../problemCategory/problemCategory.module';
import { ProjectModule } from '../project/project.module';
import { StateModule } from '../state/state.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql', '/var/task/src/nestjs/**/*.graphql'],
      context: ({ req, connection }) => {
        if (connection) {
          return { ...req, userId: connection.context.userId };
        } else {
          return { req };
        }
      },
      installSubscriptionHandlers: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TicketModule,
    TaskModule,
    DefaultTaskModule,
    ProblemCategoryModule,
    ProjectModule,
    StateModule,
  ],
})
export class AppModule {}
