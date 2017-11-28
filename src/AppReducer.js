import { combineReducers } from 'redux'
import MonitorReducers from './Monitor/MonitorReducers'

const AppReducers = combineReducers({
  MonitorReducers,
})

export default AppReducers
