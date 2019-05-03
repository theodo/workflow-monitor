import React from 'react';
import Button from '@material-ui/core/Button';
import { Mutation } from 'react-apollo';
import { SET_LOGIN_USER } from 'Apollo/Queries/Login';

const Login = () => (
  <Mutation mutation={SET_LOGIN_USER}>
    {(setLoginUser, { loading, error }) => {
      // if (localStorage.getItem('trello_token')) {
      //   setLoginUser({ variables: { interactive: false } });
      // }
      return (
        <div className="Login">
          <Button
            onClick={() => {
              setLoginUser({ variables: { interactive: true } });
            }}
          >
            Login with Trello
          </Button>
          {loading && <p>Loading...</p>}
          {error && <p>Error...</p>}
        </div>
      );
    }}
  </Mutation>
);

export default Login;
