import { connect } from 'react-redux';

import Settings from './view';
import { saveSettings } from './SettingsActions';

const mapStateToProps = state => {
  return {
    settings: state.SettingsReducers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveSettings: settings => {
      dispatch(saveSettings(settings));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
