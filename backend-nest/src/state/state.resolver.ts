import { UseGuards, Inject } from '@nestjs/common';
import { Resolver, Mutation, Subscription, Args, Context } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class StateResolver {
  constructor(@Inject('PUB_SUB') private readonly pubsub: PubSub) {}
  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateCurrentState(@CurrentUser() user: User, @Args('state') state) {
    const channel = 'user#' + user.id;
    this.pubsub.publish(channel, { state });
    await user.set('state', state);
    await user.save();
    return 1;
  }

  @Subscription('state')
  subscribe(@Context('userId') userId) {
    const channel = 'user#' + userId;
    return this.pubsub.asyncIterator(channel);
  }
}
