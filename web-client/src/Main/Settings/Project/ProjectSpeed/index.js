import { withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack/build';
import { connect } from 'react-redux';
import { saveProjectSpeedSettings } from 'Login/LoginActions';
import { compose } from 'redux';

import ProjectSpeed, { styles } from './view';

const mapStateToProps = state => {
  return {
    project: state.LoginReducers.currentProject,
  };
};

const mapDispatchToProps = dispatch => ({
  updateSelectedProjectSettings: ({ celerity, dailyDevelopmentTime }) => {
    dispatch(saveProjectSpeedSettings({ celerity, dailyDevelopmentTime }));
  },
});

export default compose(
  withStyles(styles),
  withSnackbar,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ProjectSpeed);
