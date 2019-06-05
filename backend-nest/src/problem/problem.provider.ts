import { Problem } from './problem.entity';

export const problemsProvider = [
  {
    provide: 'ProblemRepository',
    useValue: Problem,
  },
];
