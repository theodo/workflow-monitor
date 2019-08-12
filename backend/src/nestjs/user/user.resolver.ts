import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from './user.decorator';
import { User } from './user.entity';

@Resolver()
export class UserResolvers {
  @Query()
  @UseGuards(GraphqlAuthGuard)
  hello(@CurrentUser() user: User) {
    return `Hello ${user.fullName ? user.fullName : 'World'}`;
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
