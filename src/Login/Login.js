import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { push } from 'react-router-redux';

const trelloAuthParams = {
  type: 'popup',
  name: 'Workflow Monitor',
  scope: {
    read: 'true',
    write: 'true' },
  expiration: 'never',
};

class Login extends Component {
  constructor(props) {
    super(props);
    window.Trello.authorize({
      ...trelloAuthParams,
      interactive: false,
      success: () => this.authenticationSuccess(),
      error: this.authenticationFailure
    });
  }
  authenticationSuccess(){
    this.props.login();
  }
  authenticationFailure(){}
  handleLoginButtonClick(){
    window.Trello.authorize({
      ...trelloAuthParams,
      success: () => this.authenticationSuccess(),
      error: this.authenticationFailure
    });
  }
  render() {
    return (
      <div className="Login">
        <Button onClick={() => this.handleLoginButtonClick()}>Login with Trello</Button>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    login: () => {
      dispatch(push('/'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
