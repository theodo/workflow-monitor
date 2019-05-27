import gql from 'graphql-tag';

export const GET_DEFAULT_TASKS_LISTS = gql`
  {
    defaultTasksLists {
      id
      type
      defaultTasks {
        id
        description
        estimatedTime
        check
      }
    }
  }
`;

export const SAVE_DEFAULT_TASKS_LIST = gql`
  mutation SaveDefaultTasksList($defaultTasksList: DefaultTasksListDTO) {
    saveDefaultTasksList(defaultTasksList: $defaultTasksList)
  }
`;
