const { app, ipcMain, globalShortcut } = require('electron');
const { getStateSubscription, getGqlClient } = require('./api');
const gql = require('graphql-tag');
const MonitorReducers = require('./reducers');
const { getToken, writeToken } = require('./auth.js');
const { ERROR_IDS, ERROR_MESSAGES } = require('./constants');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

let store = MonitorReducers();
let loginSuccessful = false;

const initCli = window => {
  const token = getToken();
  const gqlClient = getGqlClient();

  if (token) {
    gqlClient
      .query({
        query: gql`
          {
            currentUser {
              state
            }
          }
        `,
      }).then(({ data: { currentUser: { state } } }) => {
        if (state) {
          loginSuccessful = true;
          store = MonitorReducers(store, {
            type: 'UPDATE',
            state: JSON.parse(state),
          });
          window.webContents.send('new-state', { ...store, hideTokenBlock: true });
        }
      })
      .catch(error => console.log(error));

    stateSubscription = getStateSubscription();
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
  else {
    window.webContents.send('no-token', store);
  }
}

const casprCli = window => {
  initCli(window);

  ipcMain.on('jwt-token-update', (event, token) => {
    if (token && token !== getToken()) {
      writeToken(token);
      initCli(window);
    }
  });

  setInterval(() => {
    if (loginSuccessful) {
      window.webContents.send('new-state', { ...store, doNotShowNotification: true });
    }
  }, 1000);

  ipcMain.on('previous-task', () => {
    previousTaskTrigger(window);
  });

  ipcMain.on('next-task', (event) => {
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
    return window.webContents.send('new-state', {
      ...store,
      error: {
        id: ERROR_IDS.PREVIOUS_WHEN_FIRST_TASK,
        message: ERROR_MESSAGES.PREVIOUS_WHEN_FIRST_TASK,
      }
    });
  }

  if (store.dateLastPause) {
    store = MonitorReducers(store, { type: 'PLAY_OR_PAUSE_SESSION', shouldUpdateState: false });
    store = MonitorReducers(store, { type: 'PREVIOUS_TASK' });
    return;
  }

  store = MonitorReducers(store, { type: 'PREVIOUS_TASK' });
};

const nextTaskTrigger = (window) => {
  if (store.currentStep === 'RESULTS') {
    return window.webContents.send('new-state', {
      ...store, error: {
        id: ERROR_IDS.NEXT_WHEN_RESULTS,
        message: ERROR_MESSAGES.NEXT_WHEN_RESULTS,
      }
    });
  }
  if (store.dateLastPause) {
    store = MonitorReducers(store, { type: 'PLAY_OR_PAUSE_SESSION', shouldUpdateState: false });
    store = MonitorReducers(store, { type: 'NEXT_TASK' });
    return;
  }

  if (store.tasks[store.currentTaskIndex].check && !store.taskPanelChanges.currentTaskCheckOK) {
    return window.webContents.send('new-state', {
      ...store, error: {
        id: ERROR_IDS.UNCHECKED_TASK,
        message: ERROR_MESSAGES.UNCHECKED_TASK,
      }
    });
  }

  store = MonitorReducers(store, { type: 'NEXT_TASK' });
};

const playPauseTrigger = window => {
  store = MonitorReducers(store, { type: 'PLAY_OR_PAUSE_SESSION', shouldUpdateState: true });
};

module.exports = casprCli;
