const { LocalStorage } = require('node-localstorage');
const readlineSync = require('readline-sync');

const localStorage = new LocalStorage('./token');

const writeToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');

const askCredentials = () => {
  if (getToken()) return;

  const token = readlineSync.question('Enter your JWT token (Go to http://caspr.theo.do > Settings > Copy CLI token) :')
  writeToken(token);

  console.log('Your token has been saved, you can restart caspr-cli')
  process.exit()
}


module.exports = { askCredentials, getToken }
