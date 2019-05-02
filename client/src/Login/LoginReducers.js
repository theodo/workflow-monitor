import { LOGIN, SELECT_PROJECT, SAVE_PROJECT_SPEED_SETTINGS } from './LoginActions';

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
    case SAVE_PROJECT_SPEED_SETTINGS:
      newState = {
        ...state,
        currentProject: {
          ...state.currentProject,
          ...action.settings,
        },
      };
      break;
    default:
      newState = state;
  }
  return newState;
};

export default LoginReducers;
