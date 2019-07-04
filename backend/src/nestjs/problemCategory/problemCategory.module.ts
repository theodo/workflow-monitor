import { Module, HttpModule } from '@nestjs/common';
import { ProblemCategoryService } from './problemCategory.service';
import { ProblemCategoryResolver } from './problemCategory.resolver';
import { DatabaseModule } from '../database/database.module';
import { problemCategoriesProvider } from './problemCategory.provider';
import { PassportModule } from '@nestjs/passport';
import { problemsProvider } from '../problem/problem.provider';

@Module({
  imports: [HttpModule, DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    ProblemCategoryResolver,
    ProblemCategoryService,
    ...problemCategoriesProvider,
    ...problemsProvider,
  ],
  exports: [
    ProblemCategoryResolver,
    ProblemCategoryService,
    ...problemCategoriesProvider,
    ...problemsProvider,
  ],
})
export class ProblemCategoryModule {}
