export const LOGIN = 'LOGIN';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const SAVE_PROJECT_SPEED_SETTINGS = 'SAVE_PROJECT_SPEED_SETTINGS';

export function login(user) {
  return {
    type: LOGIN,
    user,
  };
}

export function selectProject(project) {
  return {
    type: SELECT_PROJECT,
    project,
  };
}

export const saveProjectSpeedSettings = settings => {
  return {
    type: SAVE_PROJECT_SPEED_SETTINGS,
    settings,
  };
};
