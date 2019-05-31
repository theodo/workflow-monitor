import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [__dirname + '/../**/*.graphql'],
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
