import { DefaultTaskList } from './defaultTaskList.entity';

export const DefaultTaskListsProvider = [
  {
    provide: 'DefaultTaskListRepository',
    useValue: DefaultTaskList,
  },
];
