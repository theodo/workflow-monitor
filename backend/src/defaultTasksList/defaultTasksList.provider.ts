import { DefaultTasksList } from './defaultTasksList.entity';

export const DefaultTasksListsProvider = [
  {
    provide: 'DefaultTasksListRepository',
    useValue: DefaultTasksList,
  },
];
