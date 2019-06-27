
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
const playPauseElement = document.getElementById('play-pause');
const currentTimeElement = document.getElementById('current-time-block');
const jwtTokenBlock = document.getElementById("jwt-token-block");
const updateTokenButton = document.getElementById("update-token-button");
const mainBlock = document.getElementById("main-block");

ipcRenderer.on('new-state', (event, newState) => {
  state = newState;

  console.log(state);

  currentTimeElement.style.display = "block";
  playPauseElement.style.display = "block";
  updateTokenButton.style.display = "block";
  mainBlock.style.display = "block";

  switch (state.currentStep) {
    case MONITOR_STEPS.WORKFLOW:

      const currentTask = state.tasks[state.currentTaskIndex];
      const sessionStatus = state.dateLastPause ? 'paused' : 'running';
      const elapsedTime = formatMilliSecondToTime(
        getTimer(state.taskChrono, state.dateLastPause),
      );
      document.getElementById('current-ticket').innerHTML =
        state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML =
        currentTask.description;
      document.getElementById('current-time').innerHTML =
        elapsedTime

      const estimatedTime = formatMilliSecondToTime(currentTask.estimatedTime);

      if (!state.doNotShowNotification) {
        if (state.error && state.error.id === ERROR_IDS.PREVIOUS_WHEN_FIRST_TASK) {
          new Notification(
            `Cannot go backwards`,
            {
              body: ERROR_MESSAGES.PREVIOUS_WHEN_FIRST_TASK,
              silent: true,
            },
          );
        }
        else if (state.error && state.error.id === ERROR_IDS.UNCHECKED_TASK) {

          const notification = new Notification(
            `Have you completed the checks for this task?`,
            {
              body: ERROR_MESSAGES.UNCHECKED_TASK,
              silent: true,
              data: 'https://caspr.theo.do/#/monitor',
            },
          );

          notification.onclick = function (e) {
            window.open(e.target.data, '_blank');
          }
        }
        else if (state.taskPanelChanges.newTasks && state.taskPanelChanges.newTasks.length > 0) {
          const lengthNewTasksArray = state.taskPanelChanges.newTasks.length;
          new Notification(
            `New task added`,
            {
              body: state.taskPanelChanges.newTasks[lengthNewTasksArray - 1].description,
              silent: true,
            },
          );
        }
        else if (state.tasks[state.currentTaskIndex].check && state.taskPanelChanges.currentTaskCheckOK) {
          new Notification(
            `Check completed`,
            {
              body: state.tasks[state.currentTaskIndex].check,
              silent: true,
            },
          );
        }
        else {
          if (elapsedTime > estimatedTime) {
            const notification = new Notification(
              `Caspr ${sessionStatus} - ${state.tasks[state.currentTaskIndex].description}`,
              {
                body: `${elapsedTime} / ${estimatedTime}. Time is over for this task : click this notification to report your problems`,
                requireInteraction: true,
                silent: false,
                data: 'https://caspr.theo.do/#/monitor'
              },
            );
            notification.onclick = function (e) {
              window.open(e.target.data, '_blank');
            }
          }
          else {
            new Notification(
              `Caspr ${sessionStatus} - ${state.tasks[state.currentTaskIndex].description}`,
              {
                body: `${elapsedTime} / ${estimatedTime}`,
                silent: true,
              },
            );
          }
        }
      }
      else {
        if (elapsedTime === estimatedTime) {
          const notification = new Notification(
            `Time over for this task`,
            {
              body: `Click this notification to report your problems`,
              requireInteraction: true,
              silent: false,
              data: 'https://caspr.theo.do/#/monitor'
            },
          );
          notification.onclick = function (e) {
            window.open(e.target.data, '_blank');
          }
        }
      }
      break;
    case MONITOR_STEPS.RESULTS:
      document.getElementById('current-ticket').innerHTML =
        state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML = 'Done';
      currentTimeElement.style.display = "none";
      playPauseElement.style.display = "none";

      if (state.error && state.error.id === ERROR_IDS.NEXT_WHEN_RESULTS) {
        new Notification(
          `Cannot go forward`,
          {
            body: ERROR_MESSAGES.NEXT_WHEN_RESULTS,
            silent: true,
          },
        );
      }
      else if (!state.doNotShowNotification) {
        new Notification(state.currentTrelloCard.name, {
          body: 'Ticket done!',
          silent: true,
        });
      }
      break;
    default:
      document.getElementById('current-ticket').innerHTML =
        'Waiting for ticket start';
      document.getElementById('current-task').innerHTML =
        'Waiting for ticket start';
      document.getElementById('current-time').innerHTML =
        'Waiting for ticket start'
      break;
  }
});


ipcRenderer.on('no-token', (event, newState) => {
  jwtTokenBlock.style.display = "block";
  updateTokenButton.style.display = "none";
  mainBlock.style.display = "none";
});

document.getElementById('jwt-token-submit').addEventListener('click', () => {
  console.log(document.getElementById('jwt-token-input').value);
  if (document.getElementById('jwt-token-input').value) {
    ipcRenderer.send(
      'jwt-token-update',
      document.getElementById('jwt-token-input').value,
    );
    jwtTokenBlock.style.display = "none";
  }
});

document.getElementById('previous-task').addEventListener('click', () => {
  ipcRenderer.send('previous-task');
});

document.getElementById('next-task').addEventListener('click', () => {
  ipcRenderer.send('next-task');
});

document.getElementById('play-pause').addEventListener('click', () => {
  ipcRenderer.send('play-pause');
});

document.getElementById('update-token-button').addEventListener('click', () => {
  jwtTokenBlock.style.display = "block";
});
