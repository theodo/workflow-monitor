import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux';
import AppReducer from './AppReducer';
import Login from './Login/Login';
import Main from './Main/Main';
import './App.css';

const history = createHistory();
const middleware = routerMiddleware(history);

let store = createStore(
  AppReducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(middleware)
);

store.dispatch(push('/login'));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="App">
            <Switch>
              <Route path="/login" component={Login}/>
              <Route component={Main}/>
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
