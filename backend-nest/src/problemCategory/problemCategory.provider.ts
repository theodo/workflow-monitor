import { ProblemCategory } from './problemCategory.entity';

export const problemCategoriesProvider = [
  {
    provide: 'ProblemCategoryRepository',
    useValue: ProblemCategory,
  },
];
