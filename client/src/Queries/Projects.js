import gql from 'graphql-tag';

export const GET_CURRENT_PROJECT = gql`
  {
    currentProject {
      id
      name
      dailyDevelopmentTime
      celerity
      thirdPartyType
      thirdPartyId
    }
  }
`;

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;
