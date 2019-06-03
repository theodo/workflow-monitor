const { app, BrowserWindow } = require('electron');
const casprCli = require('./cli');
const DEV = 'DEV';
const PROD = 'PROD';

const env = DEV;

if (env === DEV) {
  const electron = require('electron');

// Enable live reload for Electron too
  require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/../node_modules/electron`)
  });
}

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

  // window.webContents.openDevTools();

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('current-task-update', 'hello');
    casprCli(window);
  });

  if (env === DEV) {
    window.webContents.openDevTools();
  }
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
