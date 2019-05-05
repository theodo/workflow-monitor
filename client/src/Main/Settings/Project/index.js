import { initSession } from 'Main/Monitor/MonitorActions';
import { connect } from 'react-redux';

import Project from './view';
import { saveSettings } from '../SettingsActions';

const mapDispatchToProps = dispatch => {
  return {
    selectProject: () => {
      dispatch(initSession());
      dispatch(saveSettings({ selectedBacklogId: undefined }));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Project);
