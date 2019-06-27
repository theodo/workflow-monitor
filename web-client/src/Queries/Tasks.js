import gql from 'graphql-tag';

export const UPDATE_TASK = gql`
  mutation UpdateTask($task: TaskInput!) {
    updateTask(task: $task) {
      id
      description
      estimatedTime
      realTime
      addedOnTheFly
      problems {
        id
        description
        problemCategory {
          id
          description
        }
      }
    }
  }
`;
