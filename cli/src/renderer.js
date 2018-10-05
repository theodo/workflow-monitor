const timeUtils = require('./TimeUtils');

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};

let showTimer = false;
let time = 0;
let state = {};

const getTime = (dateLastPause, chrono) => {
  if (!chrono.dateLastStart) return 0;
  const now = (new Date()).getTime();

  return dateLastPause ?
    chrono.elapsedTime + (dateLastPause - chrono.dateLastStart)
    : chrono.elapsedTime + (now - chrono.dateLastStart);
}

setInterval(() => {
  if(showTimer){
    time++;
    process.stdout.write(`Total time : ${timeUtils.formatMilliSecondToTime(getTime(state.dateLastPause, state.taskChrono))} / ${timeUtils.formatMilliSecondToTime(state.tasks[state.currentTaskIndex].estimatedTime)}\r`);
  }
}, 1000);

const render = (newState) => {
  state = newState;
  console.log('\x1Bc');
  showTimer = !state.isSessionPaused && state.currentStep === MONITOR_STEPS.WORKFLOW;
  switch (state.currentStep) {
    case MONITOR_STEPS.WORKFLOW:
      console.log(`${state.currentTrelloCard.name} - Task ${state.currentTaskIndex}/${state.tasks.length}`);
      console.log(`\n`);
      console.log(state.tasks[state.currentTaskIndex].label);
      console.log(`\n`);
      break;
    case MONITOR_STEPS.RESULTS:
      console.log(`Ticket terminé`);
      break;
    default:
      console.log('Waiting for ticket start...');
      break;
  }
};

module.exports = render
