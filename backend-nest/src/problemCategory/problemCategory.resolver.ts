import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/gqlAuthguard';
import { User as CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { ProblemCategoryService } from './problemCategory.service';

@Resolver()
export class ProblemCategoryResolver {
  constructor(private readonly problemCategoryService: ProblemCategoryService) {}

  @Query()
  @UseGuards(GraphqlAuthGuard)
  async problemCategories(@CurrentUser() user: User) {
    const res = await this.problemCategoryService.getAllByProject(user.currentProject.id);
    return res.map(problemCategory => problemCategory.dataValues);
  }

  @Query()
  @UseGuards(GraphqlAuthGuard)
  problemCategoriesWithPareto(
    @CurrentUser() user: User,
    @Args('startDate') startDate,
    @Args('endDate') endDate,
  ) {
    const projectId = user.currentProject.id;
    return this.problemCategoryService.getCountAndOvertime(projectId, startDate, endDate);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  addProblemCategory(
    @CurrentUser() user: User,
    @Args('problemCategoryDescription') problemCategoryDescription,
  ) {
    return this.problemCategoryService.add(problemCategoryDescription, user.currentProject.id);
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async updateProblemCategoryDescription(@Args('problemCategory') problemCategory) {
    await this.problemCategoryService.updateDescription(
      problemCategory.id,
      problemCategory.description,
    );
    return 1;
  }

  @Mutation()
  @UseGuards(GraphqlAuthGuard)
  async deleteProblemCategory(@Args('problemCategoryId') problemCategoryId: number) {
    const isProblemCategoryDeletable = await this.problemCategoryService.isProblemCategoryDeletable(
      problemCategoryId,
    );
    if (isProblemCategoryDeletable) {
      await this.problemCategoryService.deleteProblemCategory(problemCategoryId);
      return 1;
    } else {
      throw Error('Cannot delete this ProblemCategory because there is a Problem related to it');
    }
  }
}
