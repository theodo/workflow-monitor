import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import MonitorReducers from './Main/Monitor/MonitorReducers';
import SettingsReducers from './Main/Settings/SettingsReducers';
import LoginReducers from './Login/LoginReducers';

const AppReducers = combineReducers({
  MonitorReducers,
  SettingsReducers,
  LoginReducers,
  routerReducer,
});

export default AppReducers;
