const { app, ipcMain, globalShortcut } = require('electron');
const { stateSubscription, gqlClient } = require('./api');
const gql = require('graphql-tag');
const MonitorReducers = require('./MonitorReducers');
const { getToken, writeToken } = require('./auth.js');
const { ERROR_IDS, ERROR_MESSAGES } = require('./constants');

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
  if (store.currentTaskIndex === 1) {
    window.webContents.send('new-state', {
      ...store,
      error: {
        id: ERROR_IDS.PREVIOUS_WHEN_FIRST_TASK,
        message: ERROR_MESSAGES.PREVIOUS_WHEN_FIRST_TASK,
      }
    });
  } else {
    store = MonitorReducers(store, { type: 'PREVIOUS_TASK' });
  }
};

const nextTaskTrigger = window => {
  if (store.currentStep !== 'RESULTS') {
    store = MonitorReducers(store, { type: 'NEXT_TASK' });
  }
  else {
    window.webContents.send('new-state', {
      ...store, error: {
        id: ERROR_IDS.NEXT_WHEN_RESULTS,
        message: ERROR_MESSAGES.NEXT_WHEN_RESULTS,
      }
    });
  }
};

const playPauseTrigger = window => {
  store = MonitorReducers(store, { type: 'PLAY_OR_PAUSE_SESSION' });
};

module.exports = casprCli;
