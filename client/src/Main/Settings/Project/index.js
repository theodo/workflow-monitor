import { initSession } from 'Main/Monitor/MonitorActions';
import { selectProject } from 'Login/LoginActions';
import { connect } from 'react-redux';

import Project from './view';
import { saveSettings } from '../SettingsActions';

const mapStateToProps = state => {
  return {
    project: state.LoginReducers.currentProject,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: project => {
      dispatch(initSession());
      dispatch(saveSettings({ selectedBacklogId: undefined }));
      dispatch(selectProject(project));
      window.location.hash = '#/';
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Project);
