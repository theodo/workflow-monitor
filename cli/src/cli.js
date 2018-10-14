const readline = require('readline');
const { stateSubscription } = require('./api')
const MonitorReducers = require('./MonitorReducers')
const render = require('./renderer')
const data = require('./data')
const { askCredentials } = require('./auth')

const development = false;

const clear = () => {
  console.log('\x1Bc');
}

const main = () => {
  askCredentials();

  let store = MonitorReducers();
  clear();
  if (development) {
    store = MonitorReducers(store, {type: 'UPDATE', state: data});
    render(store);
  } else {
    stateSubscription.subscribe({
      next (data) {
        store = MonitorReducers(store, {type: 'UPDATE', state: JSON.parse(data.data.state)});
        render(store);
      }
    },() => console.log('error'));
  }

  readline.emitKeypressEvents(process.stdin);
  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      if(store.currentStep == 'WORKFLOW') {
        switch (key.name) {
          case 'n':
            store = MonitorReducers(store, {type: 'NEXT_TASK'});
            break;
          case 'p':
            if (store.currentTaskIndex > 1) store = MonitorReducers(store, {type: 'PREVIOUS_TASK'});
            break;
          case 'space':
            store = MonitorReducers(store, {type: 'PLAY_OR_PAUSE_SESSION'});
            break;
          default:
            break;
        }
      }
      render(store);
    }
  });

  console.log('Waiting for ticket start...');
}

module.exports = main
