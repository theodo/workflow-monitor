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

export const GET_TASK = gql`
  query GetTask($taskId: Int!) {
    task(taskId: $taskId) {
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
