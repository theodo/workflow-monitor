import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Resolver()
export class TaskResolvers {
  constructor(private readonly taskService: TaskService) {}
  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateTask(@Args('task') task: Task) {
    return await this.taskService.updateTask(task);
  }
}
