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

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [__dirname + '/../**/*.graphql'],
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TicketModule,
    DefaultTaskModule,
    ProblemCategoryModule,
    ProjectModule,
    StateModule,
  ],
})
export class AppModule {}
