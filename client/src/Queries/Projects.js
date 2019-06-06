import gql from 'graphql-tag';

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;

export const SET_PROJECT_PERFORMANCE_TYPE = gql`
  mutation setProjectPerformanceType($projectPerformanceType: String!) {
    setProjectPerformanceType(projectPerformanceType: $projectPerformanceType)
  }
`;

export const GET_PROJECT_PERFORMANCE_TYPE = gql`
  query GetProjectPerformanceType {
    getProjectPerformanceType
  }
`;

export const SELECT_PROJECT = gql`
  mutation($project: ProjectInput) {
    selectProject(project: $project) {
      id
      name
      thirdPartyId
    }
  }
`;
