import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Subscription, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver()
export class StateResolver {
  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateCurrentState(@CurrentUser() user: User, @Args('state') state) {
    const channel = 'user#' + user.id;
    pubsub.publish(channel, { state });
    await user.set('state', state);
    await user.save();
    return 1;
  }

  @Subscription('state')
  @UseGuards(GraphqlAuthGuard)
  subscribe(@CurrentUser() user: User) {
    const channel = 'user#' + user.id;
    return pubsub.asyncIterator(channel);
  }
}
