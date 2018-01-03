import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Route, Switch } from 'react-router';

import { HashRouter } from 'react-router-dom';
import AppReducer from './AppReducer';
import Login from './Login/Login';
import Main from './Main/Main';
import './App.css';

let store = createStore(
  AppReducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.location.hash = '#/login';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <div className="App">
            <Switch>
              <Route exact path="/login" component={Login}/>
              <Route path="/" component={Main}/>
            </Switch>
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
