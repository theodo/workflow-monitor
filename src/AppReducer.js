import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import MonitorReducers from './Monitor/MonitorReducers';

const AppReducers = combineReducers({
  MonitorReducers,
  routerReducer,
});

export default AppReducers;
