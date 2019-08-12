import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
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
