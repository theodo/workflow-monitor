import React, { Component } from 'react'
import { formatStringToTasks } from '../../Utils/StringUtils'
import { formatSecondToTime } from '../../Utils/TimeUtils'
import './TaskPanel.css'

class TaskPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeoutStartedAt: new Date(),
      elapsedTime: 0,
      problem: '',
    }
    this.handleProblemValueChange = this.handleProblemValueChange.bind(this);
    this.handleNewTasksValueChange = this.handleNewTasksValueChange.bind(this);
    this.initAlarm(props.currentTask.estimatedTime);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.isPaused && !this.props.isPaused){
      clearTimeout(this.timeout);
      const now = new Date();
      const timeSinceTimeoutStarted = (now.getTime() - this.state.timeoutStartedAt.getTime()) / 1000;
      this.setState({
        elapsedTime: this.state.elapsedTime + timeSinceTimeoutStarted,
      });
    } else if (!nextProps.isPaused && this.props.isPaused){
      this.setState({timeoutStartedAt: new Date()});
      this.initAlarm(this.props.currentTask.estimatedTime);
    }
    if (nextProps.currentTask && nextProps.currentTask !== this.props.currentTask) {
      this.setState({problem: '', elapsedTime: 0, timeoutStartedAt: new Date()})
      this.initAlarm(nextProps.currentTask.estimatedTime);
    }
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
  handleProblemValueChange = (event) => {
    this.setState({problem: event.target.value});
  }
  handleNewTasksValueChange = (event) => {
    this.props.handleNewTasksValueChange(
      formatStringToTasks(event.target.value).map((task) => ({ ...task, addedOnTheFly: true }))
    );
  }
  getProblem = () => this.state.problem;
  initAlarm = (timeInSecond) => {
    if (timeInSecond && timeInSecond > this.state.elapsedTime) this.timeout = setTimeout(() => {
      var audio = new Audio('alarm.mp3');
      audio.play();
    }, (timeInSecond - this.state.elapsedTime) * 1000);
  }
  render() {
    return (
      <div className="TaskPanel">
        <h2>{this.props.currentTask.label}</h2>
        {
          this.props.currentTask.estimatedTime ?
            <h3>Estimated time : {formatSecondToTime(this.props.currentTask.estimatedTime)}</h3>
            : null
        }
        <h3>Problems :</h3>
        <textarea value={this.state.problem} className="TaskPanel-problem-textarea" onChange={this.handleProblemValueChange} />
        <h3>Add tasks after this one :</h3>
        <textarea value={this.props.newTasksString} className="TaskPanel-newtasks-textarea" onChange={this.handleNewTasksValueChange} />
      </div>
    );
  }
}

export default TaskPanel;
