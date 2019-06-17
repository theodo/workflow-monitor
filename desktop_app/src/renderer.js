const { ipcRenderer } = require('electron');
const { formatMilliSecondToTime } = require('./Utils/TimeUtils');
const { getTimer } = require('./Utils/Chrono');

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};
let state = {};

ipcRenderer.on('new-state', (event, newState) => {
  state = newState;

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
      new Notification(
        `Caspr ${sessionStatus} - ${elapsedTime} / ${estimatedTime}`,
        {
          body: state.tasks[state.currentTaskIndex].description,
          silent: true,
        },
      );
      break;
    case MONITOR_STEPS.RESULTS:
      document.getElementById('current-ticket').innerHTML =
        state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML = 'Done';
      new Notification(state.currentTrelloCard.name, {
        body: 'Ticket done!',
        silent: true,
      });
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
  ipcRenderer.send('next-task');
});

document.getElementById('play-pause').addEventListener('click', () => {
  ipcRenderer.send('play-pause');
});
