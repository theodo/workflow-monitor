import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { login } from './LoginActions';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const trelloAuthParams = {
  type: 'popup',
  name: 'Workflow Monitor',
  scope: {
    read: 'true',
    write: 'true',
  },
  expiration: 'never',
};

class Login extends Component {
  state = {
    redirectToReferrer: false,
    redirectLocation: this.props.location.state || { from: { pathname: '/' } },
  };

  constructor(props) {
    super(props);
    this.trelloAuthenticationFailure = this.trelloAuthenticationFailure.bind(this);
    this.trelloAuthenticationSuccess = this.trelloAuthenticationSuccess.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);

    if (localStorage.getItem('trello_token')) {
      window.Trello.authorize({
        ...trelloAuthParams,
        interactive: false,
        success: this.trelloAuthenticationSuccess,
        error: this.trelloAuthenticationFailure,
      });
    }
  }
  trelloAuthenticationSuccess() {
    axios
      .post(process.env.REACT_APP_API_URL + '/login', {
        trelloToken: localStorage.getItem('trello_token'),
      })
      .then(response => {
        this.props.login(response.data.user, response.data.jwt);
        this.setState(state => ({
          redirectToReferrer: true,
          redirectLocation: response.data.user.currentProject
            ? state.redirectLocation
            : { from: { pathname: '/settings' } },
        }));
      })
      .catch(() => {});
  }
  trelloAuthenticationFailure() {}
  handleLoginButtonClick() {
    window.Trello.authorize({
      ...trelloAuthParams,
      success: this.trelloAuthenticationSuccess,
      error: this.trelloAuthenticationFailure,
    });
  }
  render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to={this.state.redirectLocation.from} />;
    }
    return (
      <div className="Login">
        <Button onClick={this.handleLoginButtonClick}>Login with Trello</Button>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    login: (user, jwtToken) => {
      localStorage.setItem('jwt_token', jwtToken);
      dispatch(login(user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
