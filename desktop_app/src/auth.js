const storage = require('electron-json-storage-sync');

const writeToken = token => {
  storage.set('jwt_token', token);
};

const getToken = () => {
  const result = storage.get('jwt_token');
  return result.data;
};

module.exports = { getToken, writeToken };
