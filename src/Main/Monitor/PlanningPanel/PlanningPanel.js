import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import { initAlarm, cancelAlarm } from '../../../Utils/AlarmUtils';
import { getTotalTime } from '../../../Utils/TaskUtils';
import Button from 'material-ui/Button';
import TaskEditor from '../../TaskEditor/TaskEditor';
import { filterEmptyTasks } from '../../../Utils/TaskUtils';
import './PlanningPanel.css';

const planningMaxTime = 600000;

const TaskList = ({ tasks }) => (
  <ul className="TaskList">
    {tasks.map((task) =>
      <li key={task.id}>{task.label}{task.estimatedTime ? ' ('+task.estimatedTime/60000+')' : ''}</li>)}
  </ul>
);

class PlanningPanel extends Component {
  constructor(props){
    super(props);
    this.handleTasksDefinitionChange = this.handleTasksDefinitionChange.bind(this);
    this.buildAllTasks = this.buildAllTasks.bind(this);
    this.state = {
      tasks: [],
    };
    if(!this.props.dateLastPause) initAlarm(planningMaxTime - this.props.taskChrono.elapsedTime, false);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.dateLastPause && !this.props.dateLastPause){
      cancelAlarm();
    } else if (!nextProps.dateLastPause && this.props.dateLastPause){
      initAlarm(planningMaxTime - nextProps.taskChrono.elapsedTime, false);
    }
  }
  handleTasksDefinitionChange(tasks) {
    this.setState({ tasks });
    this.props.handlePlanningPanelChange({
      planningPanelChanges: {
        tasks: this.buildAllTasks(tasks),
      },
    });
  }
  buildAllTasks(tasks){
    return [...this.props.beginTasks, ...filterEmptyTasks(tasks), ...this.props.endTasks];
  }
  componentWillUnmount(){
    cancelAlarm();
  }
  render() {
    return (
      <div className="PlanningPanel">
        <Grid container spacing={24}>
          <Grid item xs={1} lg={2}>
          </Grid>
          <Grid item xs={10} lg={8}>
            <div className="PlanningPanel-content">
              <h2>Task list :</h2>
              <div className="PlanningPanel-save-button-container">
                <Link to="/settings"><Button raised>Edit default tasks</Button></Link>
              </div>
              <TaskList tasks={this.props.beginTasks} />
              <TaskEditor tasks={this.state.tasks} updateTasks={this.handleTasksDefinitionChange}/>
              <TaskList tasks={this.props.endTasks} />
              <p>Total estimated time : { this.state.tasks ? getTotalTime(this.buildAllTasks(this.state.tasks), 'estimatedTime') : '' }</p>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    beginTasks: state.SettingsReducers.beginTasks ? state.SettingsReducers.beginTasks : [],
    endTasks: state.SettingsReducers.endTasks ? state.SettingsReducers.endTasks : [],
  };
};

export default connect(mapStateToProps)(PlanningPanel);
