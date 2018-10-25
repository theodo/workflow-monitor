const readline = require('readline');
const { stateSubscription, gqlClient } = require('./api')
const MonitorReducers = require('./MonitorReducers')
const render = require('./renderer')
const data = require('./data')
const { askCredentials } = require('./auth')
const gql = require('graphql-tag');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const backMocked = false;

const clear = () => {
  console.log('\x1Bc');
}

const main = () => {
  askCredentials();
  let store = MonitorReducers();
  clear();
  if (backMocked) {
    store = MonitorReducers(store, {type: 'UPDATE', state: data});
    render(store);
  } else {
    gqlClient
      .query({
        query: gql`
           {
            currentUser { state }
          }
        `,
      })
      .then(({ data: {currentUser: {state}}}) => {
        if (state) {
          store = MonitorReducers(store, {type: 'UPDATE', state: JSON.parse(state)});
          render(store);
        }
      }).catch(error => console.log(error));

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
