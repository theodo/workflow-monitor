import React, { Component } from 'react';
import { connect } from 'react-redux'
import { initSession, nextTask, startSession, playOrPauseSession, resetMonitor } from './MonitorActions'
import Chrono from './Chrono/Chrono';
import PlanningPanel from './PlanningPanel/PlanningPanel';
import ResultPanel from './ResultPanel/ResultPanel';
import TaskPanel from './TaskPanel/TaskPanel';
import './Monitor.css';

export const MONITOR_STEPS = {
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
      planningPanelChanges: {
        tasks: [],
      },
      taskPanelChanges: {
        newTasks: [],
        problems: '',
      }
    };
  }
  areTasksValid = (tasks) => (tasks && tasks.length > 0)
  handleClickCenterButton = () => {
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        this.initSession();
        break;
      case MONITOR_STEPS.PLANNING:
        if (this.areTasksValid(this.state.planningPanelChanges.tasks)) this.startSession();
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
    this.props.initSession();
    this.globalChrono.start();
    this.taskChrono.start();
  }
  startTask = () => {
    this.taskChrono.reset();
    this.setState({
      taskPanelChanges : {
        newTasks: [],
        problems: '',
      }
    });
  }
  startSession = () => {
    this.props.startSession(this.state.planningPanelChanges.tasks, this.taskChrono.getTime());
    this.startTask();
  }
  goToNextTask = () => {
    this.props.nextTask(this.state.taskPanelChanges.newTasks, this.state.taskPanelChanges.problems, this.taskChrono.getTime())
    this.startTask();
    if((!this.state.taskPanelChanges.newTasks || this.state.taskPanelChanges.newTasks.length === 0)
      && this.props.currentTaskIndex >= this.props.tasks.length - 1){
      this.globalChrono.pause();
      this.taskChrono.pause();
    }
  }
  reset = () => {
    this.globalChrono.reset();
    this.taskChrono.reset();
    this.props.resetMonitor();
  }
  updateMonitorState = (fieldsToUpdate) => {
    this.setState({
      ...fieldsToUpdate,
    });
  }
  isPlanningStepValid = () => {
    return this.props.step !== MONITOR_STEPS.PLANNING || this.areTasksValid(this.state.planningPanelChanges.tasks)
  }
  renderPanel = () => {
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        return <WelcomePanel />;
      case MONITOR_STEPS.PLANNING:
        return <PlanningPanel handlePlanningPanelChange={this.updateMonitorState} />;
      case MONITOR_STEPS.WORKFLOW:
        return <TaskPanel
          ref={ref => this.taskPanel = ref}
          isPaused={this.props.isSessionPaused}
          currentTask={this.props.tasks[this.props.currentTaskIndex]}
          handleTaskPanelChange={this.updateMonitorState} />;
      case MONITOR_STEPS.RESULTS:
        return <ResultPanel results={this.props.results} />;
      default:
        break;
    }
  }
  renderPlayPauseButton = () => {
    return this.props.step === MONITOR_STEPS.PLANNING || this.props.step === MONITOR_STEPS.WORKFLOW ?
      <button className="Monitor-footer-button" onClick={this.props.playOrPauseSession} >
        {this.props.isSessionPaused ? 'PLAY' : 'PAUSE'}
      </button>
      : null
  }
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header">
          <Chrono isPaused={this.props.isSessionPaused} ref={ref => this.taskChrono = ref} />
          <Chrono isPaused={this.props.isSessionPaused} ref={ref => this.globalChrono = ref} />
        </header>
        <div className="Monitor-content">
          { this.renderPanel() }
        </div>
        <footer className="Monitor-footer">
          <div className="Monitor-footer-middle-div">
            <CenterButton step={this.props.step}
              disabled={!this.isPlanningStepValid() || this.props.isSessionPaused}
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

const mapStateToProps = state => {
  return {
    isSessionPaused: state.MonitorReducers.isSessionPaused,
    step: state.MonitorReducers.currentStep,
    tasks: state.MonitorReducers.tasks,
    currentTaskIndex: state.MonitorReducers.currentTaskIndex,
    results: state.MonitorReducers.results,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    playOrPauseSession: () => {
      dispatch(playOrPauseSession())
    },
    initSession: () => {
      dispatch(initSession())
    },
    startSession: (tasks, planningRealTime) => {
      dispatch(startSession(tasks, planningRealTime))
    },
    nextTask: (newTasks, taskProblem, taskRealTime) => {
      dispatch(nextTask(newTasks, taskProblem, taskRealTime))
    },
    resetMonitor: () => {
      dispatch(resetMonitor())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
