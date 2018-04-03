import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { initAlarm, cancelAlarm } from '../../../Utils/AlarmUtils';
import { getTotalTime } from '../../../Utils/TaskUtils';
import Button from 'material-ui/Button';
import TaskEditor from '../../TaskEditor/TaskEditor';
import { filterEmptyTasks, formatStringToTasks } from '../../../Utils/TaskUtils';
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
    this.handleTrelloChecklistSelection = this.handleTrelloChecklistSelection.bind(this);
    this.buildAllTasks = this.buildAllTasks.bind(this);
    this.state = {
      tasks: [],
      checklists: [],
      selectedChecklist: '',
    };
    if(!this.props.dateLastPause) initAlarm(planningMaxTime - this.props.taskChrono.elapsedTime, false);
    window.Trello.get(`/cards/${this.props.currentTrelloCard.id}/checklists`).then((checklists) => {
      this.setState({ checklists });
    });
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
  handleTrelloChecklistSelection(event) {
    this.setState({ selectedChecklist: event.target.value });
    window.Trello.get(`/checklists/${event.target.value}`).then((checklist) => {
      let tasksAsString = '';
      checklist.checkItems.forEach((task) => {
        tasksAsString += `${task.name}\n`;
      });
      this.handleTasksDefinitionChange(formatStringToTasks(tasksAsString));
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
              <Grid container spacing={0}>
                <Grid item xs={8}>
                  <h2>Task list :</h2>
                </Grid>
                <Grid item xs={4} className="PlanningPanel-save-button-container">
                  <Link to="/settings"><Button raised>Edit default tasks</Button></Link>
                  <FormControl style={{marginTop: 8}}>
                    <InputLabel htmlFor="selected-checklist">Import trello checklist</InputLabel>
                    <Select
                      style={{width:200}}
                      value={this.state.selectedChecklist}
                      onChange={this.handleTrelloChecklistSelection}
                      inputProps={{
                        name: 'checklist',
                        id: 'selected-checklist',
                      }}
                    >
                      { this.state.checklists.map(checklist => <MenuItem key={checklist.id} value={checklist.id}>{checklist.name}</MenuItem>) }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
