import gql from 'graphql-tag';

export const USER_LOGIN = gql`
  mutation updateUser($interactive: Boolean!) {
    updateUser(interactive: $interactive) @client
  }
`;
