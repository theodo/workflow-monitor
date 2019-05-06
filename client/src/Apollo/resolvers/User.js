import axios from 'axios';
import { authenticateTrello } from 'Utils/TrelloApiUtils';

const updateUser = async (_, { interactive }, { cache }) => {
  await authenticateTrello(interactive);
  const loginResponse = await axios.post('/api/login', {
    trelloToken: localStorage.getItem('trello_token'),
  });
  const { user, jwt } = loginResponse.data;

  localStorage.setItem('jwt_token', jwt);
  const cacheUser = {
    ...user,
    currentProject: user.currentProject ? { ...user.currentProject, __typename: 'Project' } : null,
    __typename: 'User',
  };

  const currentProject = user.currentProject
    ? { ...user.currentProject, __typename: 'Project' }
    : null;

  cache.writeData({ data: { user: cacheUser, currentProject } });

  if (user.currentProject) window.location.hash = '#/';
  else window.location.hash = '#/settings';

  return null;
};

export default { mutations: { updateUser } };
