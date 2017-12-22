import { combineReducers } from 'redux';
import MonitorReducers from './Monitor/MonitorReducers';
import PlanningPanelReducers from './Monitor/PlanningPanel/reducer';

const AppReducers = combineReducers({
  MonitorReducers,
  PlanningPanelReducers
});

export default AppReducers;
