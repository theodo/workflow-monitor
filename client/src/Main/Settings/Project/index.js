import { withStyles } from '@material-ui/core';
import { initSession } from 'Main/Monitor/MonitorActions';
import { selectProject } from 'Login/LoginActions';
import { withSnackbar } from 'notistack/build';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Project, { styles } from './view';
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
    },
  };
};

export default compose(
  withStyles(styles),
  withSnackbar,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Project);
