import { connect } from 'react-redux';
import { saveProjectSpeedSettings } from 'Login/LoginActions';

import ProjectSpeed from './view';

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectSpeed);
