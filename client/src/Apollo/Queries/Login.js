import gql from 'graphql-tag';

export const SET_LOGIN_USER = gql`
  mutation updateLoginUser($interactive: Boolean!) {
    updateLoginUser(interactive: $interactive) @client
  }
`;
