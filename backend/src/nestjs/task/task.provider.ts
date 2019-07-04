import { Task } from './task.entity';

export const taskProvider = [
  {
    provide: 'TaskRepository',
    useValue: Task,
  },
];
