import { LOGIN, SELECT_PROJECT } from './LoginActions';

const initialLoginState = {
  user: undefined,
};

const LoginReducers = (state = initialLoginState, action) => {
  let newState = {};
  switch (action.type) {
  case LOGIN:
    newState = {
      ...state,
      ...action.user,
    };
    break;
  case SELECT_PROJECT:
    newState = {
      ...state,
      currentProject: action.project,
    };
    break;
  default:
    newState = state;
  }
  return newState;
};

export default LoginReducers;
