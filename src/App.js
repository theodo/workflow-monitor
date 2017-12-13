import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import AppReducer from './AppReducer';
import Monitor from './Monitor/Monitor';
import './App.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [];
const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
);
const store = createStore(AppReducer, enhancer);

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
