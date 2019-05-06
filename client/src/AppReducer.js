import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import MonitorReducers from './Main/Monitor/MonitorReducers';
import SettingsReducers from './Main/Settings/SettingsReducers';

const AppReducers = combineReducers({
  MonitorReducers,
  SettingsReducers,
  routerReducer,
});

export default AppReducers;
