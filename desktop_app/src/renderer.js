const { ipcRenderer } = require('electron');

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS'
};
let state = {};

ipcRenderer.on('new-state', (event, newState) => {
  state = newState;

  switch (state.currentStep) {
    case MONITOR_STEPS.WORKFLOW:
      document.getElementById('current-ticket').innerHTML = state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML = state.tasks[state.currentTaskIndex].description;
      break;
    case MONITOR_STEPS.RESULTS:
      document.getElementById('current-ticket').innerHTML = state.currentTrelloCard.name;
      document.getElementById('current-task').innerHTML = 'Done';
      break;
    default:
      document.getElementById('current-ticket').innerHTML = 'Waiting for ticket start';
      break;
  }
});

document.getElementById('jwt-token-submit').addEventListener('click', () => {
  console.log(document.getElementById('jwt-token-input').value);
  ipcRenderer.send('jwt-token-update', document.getElementById('jwt-token-input').value);
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
