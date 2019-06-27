import { DefaultTask } from './defaultTask.entity';

export const defaultTasksProvider = [
  {
    provide: 'DefaultTaskRepository',
    useValue: DefaultTask,
  },
];
