import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux';
import AppReducer from './AppReducer';
import Monitor from './Monitor/Monitor';
import Login from './Login/Login';
import Home from './Home/Home';
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
            <Route exact path="/" component={Home}/>
            <Route path="/monitor" component={Monitor}/>
            <Route path="/login" component={Login}/>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
