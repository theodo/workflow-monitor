import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from './user.decorator';
import { User } from './user.entity';

@Resolver('User')
export class UserResolvers {
  @UseGuards(GraphqlAuthGuard)
  @Query('hello')
  hello(@CurrentUser() user: User) {
    return `Hello ${user.fullName ? user.fullName : 'World'}`;
  }

  @UseGuards(GraphqlAuthGuard)
  @Query('currentUser')
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
