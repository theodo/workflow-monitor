import { connect } from 'react-redux';
import ResultPanel from './view';
import { saveResults, setTaskFields } from '../MonitorActions';

const mapStateToProps = state => ({
  results: state.MonitorReducers.tasks.map(task => ({...task, description: task.label})),
});

const mapDispatchToProps = dispatch => ({
  handleTaskChange: (taskIndex, fields) => {
    dispatch(setTaskFields(taskIndex, fields));
  },
  saveResults: () => {
    dispatch(saveResults());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultPanel);
