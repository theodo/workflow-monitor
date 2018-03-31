import { SAVE_SETTINGS } from './SettingsActions';

const initialSettingsState = {
  selectedProjectId: undefined,
  selectedBacklogId: undefined,
};

const oldState = (JSON.parse(localStorage.getItem('settingsState')));

const currentInitialState = localStorage.getItem('settingsState') ? oldState : initialSettingsState;

const SettingsReducers = (state = currentInitialState, action) => {
  let newState = {};
  switch (action.type) {
  case SAVE_SETTINGS:
    newState = {
      ...state,
      ...action.settings,
    };
    break;
  default:
    newState = state;
  }
  localStorage.setItem('settingsState', JSON.stringify(newState));
  return newState;
};

export default SettingsReducers;
