import gql from 'graphql-tag';

const PROJECT_FRAGMENT = gql`
  fragment mainProjectFields on Project {
    id
    name
    thirdPartyId
    thirdPartyType
    celerity
    dailyDevelopmentTime
  }
`;

export const SET_PROJECT_SPEED = gql`
  mutation setCurrentProjectSpeed($projectSpeed: ProjectSpeedInput!) {
    setCurrentProjectSpeed(projectSpeed: $projectSpeed)
  }
`;

export const GET_CURRENT_PROJECT = gql`
  {
    currentProject {
      ...mainProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const GET_CURRENT_PROJECT_WITH_LIST = gql`
  query getCurrentProjectWithList {
    currentProject {
      ...mainProjectFields
      list @client
    }
  }
  ${PROJECT_FRAGMENT}
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
