import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppReducer from './AppReducer';
import Monitor from './Monitor/Monitor';
import './App.css';

let store = createStore(
  AppReducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Monitor />
        </div>
      </Provider>
    );
  }
}

export default App;
