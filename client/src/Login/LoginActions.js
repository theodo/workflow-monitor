export const LOGIN = 'LOGIN';
export const SELECT_PROJECT = 'SELECT_PROJECT';

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
