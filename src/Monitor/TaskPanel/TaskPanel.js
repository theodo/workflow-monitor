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
      problems: '',
      newTasks: '',
    }
    this.handleProblemsValueChange = this.handleProblemsValueChange.bind(this);
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
      clearTimeout(this.timeout);
      this.initAlarm(nextProps.currentTask.estimatedTime);
      this.setState({
        problems: '',
        newTasks: '',
        elapsedTime: 0,
        timeoutStartedAt: new Date()
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

  initAlarm = (timeInSecond) => {
    if (timeInSecond && timeInSecond > this.state.elapsedTime) this.timeout = setTimeout(() => {
      const audio = new Audio('alarm.mp3');
      audio.play();
    }, (timeInSecond - this.state.elapsedTime) * 1000);
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
            <h3>Estimated time : {formatSecondToTime(this.props.currentTask.estimatedTime)}</h3>
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
