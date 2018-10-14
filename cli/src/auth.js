const { LocalStorage } = require('node-localstorage');
const readlineSync = require('readline-sync');

const localStorage = new LocalStorage('./token');

const writeToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');

const askCredentials = () => {
  if (getToken()) return;

  const token = readlineSync.question('Enter your JWT token :')
  writeToken(token);
}


module.exports = { askCredentials, getToken }
