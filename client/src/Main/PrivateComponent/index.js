import PrivateRoute from './view';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  trelloId: state.LoginReducers.trelloId,
});

export default connect(mapStateToProps)(PrivateRoute);
