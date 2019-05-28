import gql from 'graphql-tag';

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;

export const SET_PROJECT_PERFORMANCE_TYPE = gql`
  mutation setCurrentProjectSpeed($projectPerformanceType: String!) {
    setProjectPerformanceType(projectPerformanceType: $projectPerformanceType)
  }
`;

export const GET_PROJECT_PERFORMANCE_TYPE = gql`
  query GetProjectPerformanceType {
    getProjectPerformanceType
  }
`;
