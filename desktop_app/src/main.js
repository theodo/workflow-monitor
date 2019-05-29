const { app, BrowserWindow, ipcMain } = require('electron');
const { stateSubscription, gqlClient } = require('./api');
const gql = require('graphql-tag');
const MonitorReducers = require('./MonitorReducers');
const casprCli = require('./cli');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;

const main = () => {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile('src/index.html');

  window.webContents.openDevTools();

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('current-task-update', 'hello');
    casprCli(window);
  });
};

app.on('ready', main);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});
