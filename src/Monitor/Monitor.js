import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { initSession, nextTask, startSession, playOrPauseSession, resetMonitor } from './MonitorActions';
import Chrono from './Chrono/Chrono';
import PlanningPanel from './PlanningPanel/PlanningPanel';
import ResultPanel from './ResultPanel/ResultPanel';
import TaskPanel from './TaskPanel/TaskPanel';
import TasksLateralPanel from './TasksLateralPanel/TasksLateralPanel';
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
      <Button raised className="Monitor-footer-button" disabled={this.props.disabled} onClick={this.props.onClick}>
        {this.getLabel()}
      </Button>
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
  areTasksValid(tasks) {
    return tasks && tasks.length > 0;
  }
  handleClickCenterButton() {
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        this.initSession();
        break;
      case MONITOR_STEPS.PLANNING:
        if (this.areTasksValid(this.props.tasks)) this.startSession();
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
  initSession() {
    this.props.initSession();
  }
  startTask() {
    this.setState({
      taskPanelChanges : {
        newTasks: [],
        problems: '',
      }
    });
  }
  startSession = () => {
    this.props.startSession(this.state.planningPanelChanges.tasks, this.state.planningPanelChanges.title);
    this.startTask();
  }
  goToNextTask() {
    this.props.nextTask(this.state.taskPanelChanges.newTasks, this.state.taskPanelChanges.problems);
    this.startTask();
  }
  reset() {
    this.props.resetMonitor();
  }
  updateMonitorState(fieldsToUpdate) {
    this.setState({
      ...fieldsToUpdate,
    });
  }
  isCenterButtonDisabled() {
    switch (this.props.step) {
      case MONITOR_STEPS.PLANNING:
        return !this.areTasksValid(this.props.tasks) || this.props.dateLastPause;
      case MONITOR_STEPS.WORKFLOW:
        return this.props.dateLastPause;
      default:
        return false;
    }
  }
  renderPanel() {
    switch (this.props.step) {
    case MONITOR_STEPS.WELCOME:
      return <WelcomePanel />;
    case MONITOR_STEPS.PLANNING:
      return <PlanningPanel handlePlanningPanelChange={(fieldsToUpdate) => this.updateMonitorState(fieldsToUpdate)} />;
    case MONITOR_STEPS.WORKFLOW:
      return (
        <div className="Monitor-task-container">
          <TaskPanel
            dateLastPause={this.props.dateLastPause}
            taskChrono={this.props.taskChrono}
            currentTask={this.props.tasks[this.props.currentTaskIndex]}
            handleTaskPanelChange={(fieldsToUpdate) => this.updateMonitorState(fieldsToUpdate)} />
          <TasksLateralPanel
            tasks={this.props.tasks}
            results={this.props.results} />
        </div>
      );
    case MONITOR_STEPS.RESULTS:
      return <ResultPanel results={this.props.results} />;
    default:
      break;
    }
  }
  renderPlayPauseButton() {
    return this.props.step === MONITOR_STEPS.PLANNING || this.props.step === MONITOR_STEPS.WORKFLOW ?
      <Button raised className="Monitor-footer-button" onClick={this.props.playOrPauseSession} >
        {this.props.dateLastPause ? 'PLAY' : 'PAUSE'}
      </Button>
      : null;
  }
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header">
          <Chrono chrono={this.props.taskChrono} dateLastPause={this.props.dateLastPause}/>
          <Chrono chrono={this.props.globalChrono} dateLastPause={this.props.dateLastPause}/>
        </header>
        <div className="Monitor-content">
          { this.renderPanel() }
        </div>
        <footer className="Monitor-footer">
          <div className="Monitor-footer-middle-div">
            <CenterButton step={this.props.step}
              disabled={this.isCenterButtonDisabled()}
              onClick={() => this.handleClickCenterButton()}/>
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
    tasks: state.PlanningPanelReducers.tasks,
    currentTaskIndex: state.MonitorReducers.currentTaskIndex,
    results: state.MonitorReducers.results,
    taskChrono: state.MonitorReducers.taskChrono,
    globalChrono: state.MonitorReducers.globalChrono,
    dateLastPause: state.MonitorReducers.dateLastPause,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    playOrPauseSession: () => {
      dispatch(playOrPauseSession());
    },
    initSession: () => {
      dispatch(initSession());
    },
    startSession: (tasks, planningRealTime) => {
      dispatch(startSession(tasks, planningRealTime));
    },
    nextTask: (newTasks, taskProblem, taskRealTime) => {
      dispatch(nextTask(newTasks, taskProblem, taskRealTime));
    },
    resetMonitor: () => {
      dispatch(resetMonitor());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
