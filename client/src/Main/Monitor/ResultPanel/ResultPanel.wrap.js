import { connect } from 'react-redux';
import ResultPanel from './ResultPanel';
import { setTaskFields } from '../MonitorActions';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  handleTaskChange: (taskIndex, fields) => {
    dispatch(setTaskFields(taskIndex, fields));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultPanel);
