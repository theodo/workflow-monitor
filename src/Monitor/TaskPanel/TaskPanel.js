import React, { Component } from 'react'
import { formatStringToTasks } from '../../Utils/StringUtils'
import { formatSecondToTime } from '../../Utils/TimeUtils'
import './TaskPanel.css'

class TaskPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      problem: '',
    }
    this.handleProblemValueChange = this.handleProblemValueChange.bind(this);
    this.handleNewTasksValueChange = this.handleNewTasksValueChange.bind(this);
    this.initAlarm(props.currentTask.estimatedTime);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTask && nextProps.currentTask !== this.props.currentTask) {
      this.initAlarm(nextProps.currentTask.estimatedTime);
      this.setState({problem: ''})
    }
  }
  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
  handleProblemValueChange = (event) => {
    this.setState({problem: event.target.value});
  }
  handleNewTasksValueChange = (event) => {
    this.props.handleNewTasksValueChange(formatStringToTasks(event.target.value));
  }
  getProblem = () => this.state.problem;
  initAlarm = (timeInSecond) => {
    if (timeInSecond) this.timeout = setTimeout(() => {
      var audio = new Audio('alarm.mp3');
      audio.play();
    }, timeInSecond * 1000);
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
