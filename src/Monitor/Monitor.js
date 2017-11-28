import React, { Component } from 'react';
import Chrono from './Chrono/Chrono';
import PlanningPanel from './PlanningPanel/PlanningPanel';
import ResultPanel from './ResultPanel/ResultPanel';
import TaskPanel from './TaskPanel/TaskPanel';
import './Monitor.css';

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};

class CenterButton extends Component {
  getLabel(){
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        return 'START';
      case MONITOR_STEPS.RESULTS:
        return 'NEW TICKET';
      default:
        return 'NEXT';
    }
  }
  render() {
    return (
      <button className="Monitor-footer-button" disabled={this.props.disabled} onClick={this.props.onClick}>
        {this.getLabel()}
      </button>
    );
  }
}

class WelcomePanel extends Component {
  render() {
    return (
      <p>To get started, press start.</p>
    );
  }
}

class Monitor extends Component {
  constructor(props){
    super(props);
    this.state = {
      step : MONITOR_STEPS.WELCOME,
      results: [],
      tasks: [],
      currentTaskIndex: 0,
      isSprintPaused: false,
      taskPanel: {},
    };
  }
  handleClickCenterButton = () => {
    switch (this.state.step) {
      case MONITOR_STEPS.WELCOME:
        this.initSession();
        break;
      case MONITOR_STEPS.PLANNING:
        if(this.state.tasks.length > 0) this.startSession();
        break;
      case MONITOR_STEPS.WORKFLOW:
        this.goToNextTask();
        break;
      case MONITOR_STEPS.RESULTS:
        this.reset();
        break;
      default:
        break;
    }
  }
  initSession = () => {
    this.globalChrono.start();
    this.taskChrono.start();
    this.setState({
      step: MONITOR_STEPS.PLANNING,
      results: [],
      tasks: [],
      currentTaskIndex: 0,
    });
  }
  startSession = () => {
    this.state.results.push({label: 'Planning', realTime: this.taskChrono.getTime()});
    this.taskChrono.reset();
    this.setState({step : MONITOR_STEPS.WORKFLOW});
  }
  goToNextTask = () => {
    this.taskChrono.reset();
    this.state.results.push({
      ...this.state.tasks[this.state.currentTaskIndex],
      realTime: this.taskChrono.getTime(),
      problem: this.taskPanel.getProblem(),
    });
    if (this.state.taskPanel.newTasks) {
      this.setState({
        tasks: [
          ...this.state.tasks.slice(0,this.state.currentTaskIndex+1),
          ...this.state.taskPanel.newTasks,
          ...this.state.tasks.slice(this.state.currentTaskIndex+1),
        ],
        taskPanel: {
          newTasksString: '',
        }
      });

    }
    if(!this.state.taskPanel.newTasks && this.state.currentTaskIndex >= this.state.tasks.length - 1){
      this.globalChrono.pause();
      this.taskChrono.pause();
      this.setState({step : MONITOR_STEPS.RESULTS});
      return;
    }
    this.setState({currentTaskIndex : this.state.currentTaskIndex + 1});
  }
  reset = () => {
    this.globalChrono.reset();
    this.taskChrono.reset();
    this.setState({
      step: MONITOR_STEPS.WELCOME,
    });
  }
  pauseOrPlaySprint = () => {
    this.setState({
      isSprintPaused: !this.state.isSprintPaused,
    });
  }
  handleTasksDefinitionChange = (tasks) => {
    this.setState({
      tasks
    });
  }
  handleNewTasksValueChange = (newTasks) => {
    this.setState({
      taskPanel: {
        newTasks
      }
    });
  }
  isInitStepValid = () => {
    return this.state.step !== MONITOR_STEPS.PLANNING || this.state.tasks
  }
  renderPanel = () => {
    switch (this.state.step) {
      case MONITOR_STEPS.WELCOME:
        return <WelcomePanel />;
      case MONITOR_STEPS.PLANNING:
        return <PlanningPanel handleTasksDefinitionChange={this.handleTasksDefinitionChange} />;
      case MONITOR_STEPS.WORKFLOW:
        return <TaskPanel
          ref={ref => this.taskPanel = ref}
          newTasksString={this.state.taskPanel.newTasksString}
          currentTask={this.state.tasks[this.state.currentTaskIndex]}
          handleNewTasksValueChange={this.handleNewTasksValueChange}
          isPaused={this.state.isSprintPaused} />;
      case MONITOR_STEPS.RESULTS:
        return <ResultPanel results={this.state.results} />;
      default:
        break;
    }
  }
  renderPlayPauseButton = () => {
    return this.state.step === MONITOR_STEPS.PLANNING || this.state.step === MONITOR_STEPS.WORKFLOW ?
      <button className="Monitor-footer-button" onClick={this.pauseOrPlaySprint} >
        {this.state.isSprintPaused ? 'PLAY' : 'PAUSE'}
      </button>
      : null
  }
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header">
          <Chrono isPaused={this.state.isSprintPaused} ref={ref => this.taskChrono = ref} />
          <Chrono isPaused={this.state.isSprintPaused} ref={ref => this.globalChrono = ref} />
        </header>
        <div className="Monitor-content">
          { this.renderPanel() }
        </div>
        <footer className="Monitor-footer">
          <div className="Monitor-footer-middle-div">
            <CenterButton step={this.state.step}
              disabled={!this.isInitStepValid() || this.state.isSprintPaused}
              onClick={this.handleClickCenterButton}/>
          </div>
          <div className="Monitor-footer-right-div">
            {this.renderPlayPauseButton()}
          </div>
        </footer>
      </div>
    );
  }
}

export default Monitor;
