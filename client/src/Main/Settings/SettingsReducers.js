import { SAVE_SETTINGS } from './SettingsActions';
import { setMuted } from '../../Utils/AlarmUtils';

const initialSettingsState = {
  selectedProjectId: undefined,
  selectedBacklogId: undefined,
  isAlarmMuted: false
};

const oldState = JSON.parse(localStorage.getItem('settingsState'));

const currentInitialState = localStorage.getItem('settingsState') ? oldState : initialSettingsState;

setMuted(currentInitialState && currentInitialState.isAlarmMuted);

const SettingsReducers = (state = currentInitialState, action) => {
  let newState = {};
  switch (action.type) {
  case SAVE_SETTINGS:
    newState = {
      ...state,
      ...action.settings
    };
    break;
  default:
    newState = state;
  }
  localStorage.setItem('settingsState', JSON.stringify(newState));
  return newState;
};

export default SettingsReducers;
