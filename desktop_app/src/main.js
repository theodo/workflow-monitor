const { app, BrowserWindow, ipcMain } = require('electron');
let main = require('./cli.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('src/index.html');

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

  main();
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('current-task-update', 'hello');
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
