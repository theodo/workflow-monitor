const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};

let showTimer = false;

let time = 0;

setInterval(function() {
  if(showTimer){
    time++;
    process.stdout.write(`Time : ${time}s\r`);
  }
}, 1000);

const render = (state) => {
  process.stdout.write('\033c');
  showTimer = !state.isSessionPaused && state.currentStep === MONITOR_STEPS.WORKFLOW;
  switch (state.currentStep) {
    case MONITOR_STEPS.WORKFLOW:
      console.log(`Ticket en cours`);
      console.log(state.tasks[state.currentTaskIndex].label);
      break;
    case MONITOR_STEPS.RESULTS:
      console.log(`Ticket terminé`);
      break;
    default:
      console.log(' Waiting for ticket start...');
      break;
  }
};

module.exports = render
