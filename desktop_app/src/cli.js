const { app, ipcMain, globalShortcut } = require('electron');
const { stateSubscription, gqlClient } = require('./api');
const gql = require('graphql-tag');
const MonitorReducers = require('./MonitorReducers');
const { getToken, writeToken } = require('./auth.js');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

let store = MonitorReducers();

const casprCli = window => {
  const token = getToken();

  if (token && token.length > 10) {
    gqlClient
      .query({
        query: gql`
          {
            currentUser {
              state
            }
          }
        `,
      })
      .then(({ data: { currentUser: { state } } }) => {
        if (state) {
          store = MonitorReducers(store, {
            type: 'UPDATE',
            state: JSON.parse(state),
          });
          window.webContents.send('new-state', store);
        }
      })
      .catch(error => console.log(error));

    stateSubscription.subscribe(
      {
        next(data) {
          store = MonitorReducers(store, {
            type: 'UPDATE',
            state: JSON.parse(data.data.state),
          });
          window.webContents.send('new-state', store);
        },
      },
      () => console.log('error'),
    );
  }

  ipcMain.on('jwt-token-update', (event, token) => {
    writeToken(token);
    app.quit();
  });

  ipcMain.on('previous-task', () => {
    previousTaskTrigger(window);
  });

  ipcMain.on('next-task', () => {
    nextTaskTrigger(window);
  });

  ipcMain.on('play-pause', () => {
    playPauseTrigger(window);
  });

  globalShortcut.register('Alt+Shift+P', () => {
    previousTaskTrigger(window);
  });

  globalShortcut.register('Alt+Shift+N', () => {
    nextTaskTrigger(window);
  });

  globalShortcut.register('Alt+Shift+Space', () => {
    playPauseTrigger(window);
  });
};

const previousTaskTrigger = window => {
  store = MonitorReducers(store, { type: 'PREVIOUS_TASK' });
  window.webContents.send('new-state', store);
};

const nextTaskTrigger = window => {
  store = MonitorReducers(store, { type: 'NEXT_TASK' });
  window.webContents.send('new-state', store);
};

const playPauseTrigger = window => {
  store = MonitorReducers(store, { type: 'PLAY_OR_PAUSE_SESSION' });
  window.webContents.send('new-state', store);
};

module.exports = casprCli;
