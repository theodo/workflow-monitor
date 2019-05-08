import { connect } from 'react-redux';
import PrivateRoute from './view';

const mapStateToProps = state => ({
  project: state.LoginReducers.currentProject,
});

export default connect(
  mapStateToProps,
  null,
)(PrivateRoute);
