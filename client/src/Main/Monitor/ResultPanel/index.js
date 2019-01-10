import { connect } from 'react-redux';
import ResultPanel from './view';
import { setTaskFields } from '../MonitorActions';

const mapStateToProps = state => ({
  results: state.MonitorReducers.tasks,
});

const mapDispatchToProps = dispatch => ({
  handleTaskChange: (taskIndex, fields) => {
    dispatch(setTaskFields(taskIndex, fields));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultPanel);
