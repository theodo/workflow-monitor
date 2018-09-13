const readline = require('readline');
const stateSubscription = require('./api')
const MonitorReducers = require('./MonitorReducers')
const render = require('./renderer')

const clear = () => {
  process.stdout.write('\033c');
}

let store = MonitorReducers();

clear();

stateSubscription.subscribe({
  next (data) {
    store = MonitorReducers(store, {type: 'UPDATE', state: JSON.parse(data.data.state)});
    render(store);
  }
},() => console.log('error'));

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    console.log(' ::'+str+'::');
    if(store.currentStep == 'WORKFLOW') {
      switch (str) {
        case 'n':
          store = MonitorReducers(store, {type: 'NEXT_TASK'});
          break;
        case 'p':
          if (store.currentTaskIndex > 1) store = MonitorReducers(store, {type: 'PREVIOUS_TASK'});
          break;
        case ' ':
          store = MonitorReducers(store, {type: 'PLAY_OR_PAUSE_SESSION'});
          break;
        default:
          break;
      }
    }
    render(store);
  }
});


console.log(' Waiting for ticket start...');
