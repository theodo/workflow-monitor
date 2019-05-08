import * as React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;
  const authorized = !!localStorage.getItem('jwt_token');

  return (
    <Route
      {...rest}
      render={routerProps =>
        props.project && authorized ? (
          <Component {...routerProps} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: routerProps.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
