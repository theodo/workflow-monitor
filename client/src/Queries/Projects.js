import gql from 'graphql-tag';

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;
