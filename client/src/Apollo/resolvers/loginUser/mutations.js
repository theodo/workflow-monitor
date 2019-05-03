import axios from 'axios';
import { authenticateTrello } from 'Utils/TrelloApiUtils';

const updateLoginUser = async (_, { interactive }, { cache }) => {
  console.log('hello');

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

  console.log(cacheUser);

  cache.writeData({ data: { user: cacheUser } });

  if (user.currentProject) window.location.hash = '#/';
  else window.location.hash = '#/settings';

  return null;
};

export default { updateLoginUser };
