import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { PubsubService } from './pubsub.service';

@Resolver()
export class StateResolver {
  constructor(private pubsubService: PubsubService) {}
  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateCurrentState(@CurrentUser() user: User, @Args('state') state) {
    const topic = `states#${user.id}`;
    await this.pubsubService.publish(topic, state);
    await user.set('state', state);
    await user.save();
    return 1;
  }
}
