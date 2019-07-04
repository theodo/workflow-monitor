import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { DefaultTaskService } from './defaultTask.service';

@Resolver()
export class DefaultTaskResolvers {
  constructor(private readonly defaultTaskService: DefaultTaskService) {}

  @Query()
  @UseGuards(GraphqlAuthGuard)
  async defaultTasksLists(@CurrentUser() user: User) {
    if (!user.currentProject) {
      return [];
    }
    const project = user.currentProject;
    const defaultTasksLists = await this.defaultTaskService.getDefaultTasksListsByProject(
      project.id,
    );
    return defaultTasksLists ? defaultTasksLists : [];
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  async defaultTasksList(defaultTasksListId: number) {
    return await this.defaultTaskService.getDefaultTasksList(defaultTasksListId);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async saveDefaultTasksList(
    @CurrentUser() user: User,
    @Args('defaultTasksList') defaultTasksList,
  ) {
    return await this.defaultTaskService.saveDefaultTasksList(defaultTasksList, user);
  }
}
