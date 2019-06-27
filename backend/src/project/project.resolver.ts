import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { ProjectService } from './project.service';

@Resolver()
export class ProjectResolvers {
  constructor(private readonly projectService: ProjectService) {}

  @Query()
  @UseGuards(GraphqlAuthGuard)
  getProjectPerformanceType(@CurrentUser() user: User) {
    const project = user.currentProject;
    return project.performanceType;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  selectProject(@CurrentUser() user: User, @Args('project') project) {
    project.thirdPartyType = 'TRELLO';
    return this.projectService.findOrCreateProject(project, user);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async setCurrentProjectSpeed(@CurrentUser() user: User, @Args('projectSpeed') projectSpeed) {
    const project = user.get('currentProject');
    await this.projectService.updateProject(
      projectSpeed.celerity,
      projectSpeed.dailyDevelopmentTime,
      project.id,
    );
    return 1;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async setProjectPerformanceType(
    @CurrentUser() user: User,
    @Args('projectPerformanceType') projectPerformanceType,
  ) {
    const project = user.get('currentProject');
    await this.projectService.setProjectPerformanceType(projectPerformanceType, project.id);
    return 1;
  }
}
