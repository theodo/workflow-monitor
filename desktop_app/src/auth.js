const storage = require('electron-json-storage-sync');

const getToken = () => {
  const result = storage.get('jwt_token');

  return result.data;
};

module.exports = { getToken };
