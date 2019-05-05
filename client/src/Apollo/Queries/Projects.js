import gql from 'graphql-tag';

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;

export const GET_CURRENT_PROJECT = gql`
  {
    currentProject {
      id
      name
      thirdPartyId
      thirdPartyType
      celerity
      dailyDevelopmentTime
    }
  }
`;

export const SET_CURRENT_PROJECT = gql`
  mutation($project: ProjectInput) {
    selectProject(project: $project) {
      id
      name
      thirdPartyId
    }
  }
`;
