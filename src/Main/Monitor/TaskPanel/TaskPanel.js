import React, { Component } from 'react';
import { initAlarm, cancelAlarm } from '../../../Utils/AlarmUtils';
import ReverseChrono from '../ReverseChrono/ReverseChrono';
import { formatStringToTasks } from '../../../Utils/StringUtils';
import { formatMilliSecondToTime } from '../../../Utils/TimeUtils';
import './TaskPanel.css';

class TaskPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      problems: '',
      newTasks: '',
    };
    if(!this.props.dateLastPause) initAlarm(props.currentTask.estimatedTime - this.props.taskChrono.elapsedTime);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.dateLastPause && !this.props.dateLastPause){
      cancelAlarm();
    } else if (!nextProps.dateLastPause && this.props.dateLastPause){
      initAlarm(this.props.currentTask.estimatedTime - nextProps.taskChrono.elapsedTime);
    }
    if (nextProps.currentTask && nextProps.currentTask !== this.props.currentTask) {
      cancelAlarm();
      initAlarm(nextProps.currentTask.estimatedTime);
      this.setState({
        problems: '',
        newTasks: '',
      });
    }
  }
  componentWillUnmount(){
    cancelAlarm();
  }

  getFormattedTasks(stringTasks) {
    const tasks = formatStringToTasks(stringTasks);
    return tasks ? tasks.map((task) => ({ ...task, addedOnTheFly: true })) : undefined;
  }

  handleTaskPanelChange() {
    this.props.handleTaskPanelChange({
      taskPanelChanges : {
        newTasks: this.getFormattedTasks(this.state.newTasks),
        problems: this.state.problems,
      },
    });
  }
  handleProblemsValueChange(event) {
    this.setState({problems: event.target.value}, this.handleTaskPanelChange);
  }
  handleNewTasksValueChange(event) {
    this.setState({newTasks: event.target.value}, this.handleTaskPanelChange);
  }
  render() {
    return (
      <div className="TaskPanel">
        <h2>{this.props.currentTask.label}</h2>
        {
          this.props.currentTask.estimatedTime &&
            <div>
              <h3>Estimated time : {formatMilliSecondToTime(this.props.currentTask.estimatedTime)}</h3>
              <h3>Remaining time :&nbsp;
                <ReverseChrono
                  dateLastPause={this.props.dateLastPause}
                  estimatedTaskTime={this.props.currentTask.estimatedTime}
                  taskChrono={this.props.taskChrono} />
              </h3>
            </div>
        }
        <h3>Problems :</h3>
        <textarea
          value={this.state.problems}
          className="TaskPanel-problem-textarea"
          onChange={(event) => this.handleProblemsValueChange(event)} />
        <h3>Add tasks after this one :</h3>
        <textarea
          value={this.state.newTasks}
          className="TaskPanel-newtasks-textarea"
          onChange={(event) => this.handleNewTasksValueChange(event)} />
      </div>
    );
  }
}

export default TaskPanel;
