import React, { Component } from 'react'
import ReverseChrono from '../ReverseChrono/ReverseChrono'
import { formatStringToTasks } from '../../Utils/StringUtils'
import { formatMilliSecondToTime } from '../../Utils/TimeUtils'
import './TaskPanel.css'

class TaskPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      problems: '',
      newTasks: '',
    }
    this.handleProblemsValueChange = this.handleProblemsValueChange.bind(this);
    this.handleNewTasksValueChange = this.handleNewTasksValueChange.bind(this);
    if(!this.props.dateLastPause) this.initAlarm(props.currentTask.estimatedTime);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.dateLastPause && !this.props.dateLastPause){
      clearTimeout(this.timeout);
    } else if (!nextProps.dateLastPause && this.props.dateLastPause){
      this.initAlarm(this.props.currentTask.estimatedTime - nextProps.taskChrono.elapsedTime);
    }
    if (nextProps.currentTask && nextProps.currentTask !== this.props.currentTask) {
      clearTimeout(this.timeout);
      this.initAlarm(nextProps.currentTask.estimatedTime);
      this.setState({
        problems: '',
        newTasks: '',
      })
    }
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  getFormattedTasks = (stringTasks) => {
    const tasks = formatStringToTasks(stringTasks);
    return tasks ? tasks.map((task) => ({ ...task, addedOnTheFly: true })) : undefined
  }

  initAlarm = (timeInMilliSecond) => {
    if (timeInMilliSecond && timeInMilliSecond > 0) this.timeout = setTimeout(() => {
      const audio = new Audio('alarm.mp3');
      audio.play();
    }, (timeInMilliSecond));
  }

  handleTaskPanelChange = () => {
    this.props.handleTaskPanelChange({
      taskPanelChanges : {
        newTasks: this.getFormattedTasks(this.state.newTasks),
        problems: this.state.problems,
      },
    })
  }
  handleProblemsValueChange = (event) => {
    this.setState({problems: event.target.value}, this.handleTaskPanelChange);
  }
  handleNewTasksValueChange = (event) => {
    this.setState({newTasks: event.target.value}, this.handleTaskPanelChange);
  }
  render() {
    return (
      <div className="TaskPanel">
        <h2>{this.props.currentTask.label}</h2>
        {
          this.props.currentTask.estimatedTime ?
            <div>
            <h3>Estimated time : {formatMilliSecondToTime(this.props.currentTask.estimatedTime)}</h3>
            <h3>Remaining time :
              <ReverseChrono
                dateLastPause={this.props.dateLastPause}
                estimatedTaskTime={this.props.currentTask.estimatedTime}
                taskChrono={this.props.taskChrono} />
            </h3>
            </div>
            : null
        }
        <h3>Problems :</h3>
        <textarea value={this.state.problems} className="TaskPanel-problem-textarea" onChange={this.handleProblemsValueChange} />
        <h3>Add tasks after this one :</h3>
        <textarea value={this.state.newTasks} className="TaskPanel-newtasks-textarea" onChange={this.handleNewTasksValueChange} />
      </div>
    );
  }
}

export default TaskPanel;
