import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { PubSub } from '../../shared/pubsub/pubsub';

const pubsub = new PubSub();

@Resolver()
export class StateResolver {
  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateCurrentState(@CurrentUser() user: User, @Args('state') state) {
    const topic = `states#${user.id}`;
    await pubsub.publish(topic, state);
    await user.set('state', state);
    await user.save();
    return 1;
  }
}
