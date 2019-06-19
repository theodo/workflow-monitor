const { ipcRenderer } = require('electron');
const { formatMilliSecondToTime } = require('./Utils/TimeUtils');
const { getTimer } = require('./Utils/Chrono');
const { ERROR_IDS, ERROR_MESSAGES } = require('./constants');

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};



let state = {};
let checked = false;

ipcRenderer.on('new-state', async (event, newState) => {
  state = newState;
  navigator.serviceWorker.register('./service-worker.js');

  console.log(state);
  switch (state.currentStep) {
    case MONITOR_STEPS.WORKFLOW:
      const currentTask = state.tasks[state.currentTaskIndex];

      document.getElementById('current-ticket').innerHTML =
        state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML =
        currentTask.description;

      const sessionStatus = state.dateLastPause ? 'paused' : 'running';
      const elapsedTime = formatMilliSecondToTime(
        getTimer(state.taskChrono, state.dateLastPause),
      );
      const estimatedTime = formatMilliSecondToTime(currentTask.estimatedTime);
      if (state.error && state.error.id === ERROR_IDS.PREVIOUS_WHEN_FIRST_TASK) {
        new Notification(
          `Cannot go backwards`,
          {
            body: ERROR_MESSAGES.PREVIOUS_WHEN_FIRST_TASK,
            silent: true,
          },
        );
      }
      else if (state.taskPanelChanges && state.taskPanelChanges.newTasks && state.taskPanelChanges.newTasks.length > 0) {
        const lengthNewTasksArray = state.taskPanelChanges.newTasks.length;
        new Notification(
          `New task added`,
          {
            body: state.taskPanelChanges.newTasks[lengthNewTasksArray - 1].description,
            silent: true,
          },
        );
      }
      else if (state.error.id && state.error.id === ERROR_IDS.UNCHECKED_TASK) {

        navigator.serviceWorker.ready.then(a => {
          console.log('1');
          // a.showNotification('title', {
          //   body: ERROR_MESSAGES.UNCHECKED_TASK,
          //   silent: true,
          //   requireInteraction: true,
          //   actions: [{ action: 'checkDone', title: "Yes" }, { action: 'checkNotDone', title: "No" }]
          // });
          a.showNotification('title', {
            body: 'aaaaaaa'
          })
        })

        // a.addEventListener('notificationclick', function (event) {
        //   event.notification.close();
        //   if (event.action === 'checkDone') {
        //     ipcRenderer.send('next-task', true);
        //     silentlyArchiveEmail();
        //   }
        // }, false);

      }
      else {
        new Notification(
          `Caspr ${sessionStatus} - ${elapsedTime} / ${estimatedTime}`,
          {
            body: state.tasks[state.currentTaskIndex].description,
            silent: true,
          },
        );
      }
      break;
    case MONITOR_STEPS.RESULTS:
      document.getElementById('current-ticket').innerHTML =
        state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML = 'Done';
      if (state.error && state.error.id === ERROR_IDS.NEXT_WHEN_RESULTS) {
        new Notification(
          `Cannot go forward`,
          {
            body: ERROR_MESSAGES.NEXT_WHEN_RESULTS,
            silent: true,
          },
        );
      }
      else {
        new Notification(state.currentTrelloCard.name, {
          body: 'Ticket done!',
          silent: true,
        });
      }
      break;
    default:
      document.getElementById('current-ticket').innerHTML =
        'Waiting for ticket start';
      break;
  }
});

document.getElementById('jwt-token-submit').addEventListener('click', () => {
  console.log(document.getElementById('jwt-token-input').value);
  ipcRenderer.send(
    'jwt-token-update',
    document.getElementById('jwt-token-input').value,
  );
});

document.getElementById('previous-task').addEventListener('click', () => {
  ipcRenderer.send('previous-task');
});

document.getElementById('next-task').addEventListener('click', () => {
  ipcRenderer.send('next-task', false);
});

document.getElementById('play-pause').addEventListener('click', () => {
  ipcRenderer.send('play-pause');
});
