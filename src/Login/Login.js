import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

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
    if(localStorage.getItem('trello_token')){
      window.Trello.authorize({
        ...trelloAuthParams,
        interactive: false,
        success: () => this.authenticationSuccess(),
        error: this.authenticationFailure
      });
    }
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
      window.location.hash = '#/';
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
