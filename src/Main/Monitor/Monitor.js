import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { initSession, nextTask, startSession, playOrPauseSession } from './MonitorActions';
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
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
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
  handleClick(event) {
    event.target.blur();
    this.props.onClick();
  }
  render() {
    return (
      <Button raised className="Monitor-footer-button" disabled={this.props.disabled} onClick={this.handleClick} tabIndex="-1">
        {this.getLabel()} (n)
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    document.onkeypress = this.handleKeyPress;
    this.state = {
      planningPanelChanges: {
        tasks: [],
      },
      taskPanelChanges: {
        newTasks: [],
        problems: '',
        currentTaskCheckOK: false,
      }
    };
  }
  areTasksValid(tasks) {
    return tasks && tasks.length > 0;
  }
  handleKeyPress(event) {
    const targetTagName = event.target.tagName;
    if (targetTagName === 'TEXTAREA' || targetTagName === 'INPUT' || targetTagName === 'TD') return;

    if (event.which === 110) {
      this.handleClickCenterButton();
    } else if (event.which === 32) {
      this.props.playOrPauseSession();
    }
  }
  handleClickCenterButton() {
    if(this.isCenterButtonDisabled()) return;

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
      this.goToHome();
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
        currentTaskCheckOK: false,
      }
    });
  }
  startSession() {
    this.props.startSession(this.state.planningPanelChanges.tasks);
    this.startTask();
  }
  goToNextTask() {
    this.props.nextTask(this.state.taskPanelChanges.newTasks, this.state.taskPanelChanges.problems, this.props.projectId);
    this.startTask();
  }
  goToHome() {
    this.props.goToHome();
  }
  updateMonitorState(fieldsToUpdate) {
    this.setState({
      ...fieldsToUpdate,
    });
  }
  isCenterButtonDisabled() {
    switch (this.props.step) {
    case MONITOR_STEPS.PLANNING:
      return !this.areTasksValid(this.state.planningPanelChanges.tasks) || this.props.dateLastPause !== undefined;
    case MONITOR_STEPS.WORKFLOW: {
      const currentTask = this.props.tasks[this.props.currentTaskIndex];

      return this.props.dateLastPause !== undefined ||
        (currentTask.check && currentTask.check.length > 0 && !this.state.taskPanelChanges.currentTaskCheckOK);
    }
    default:
      return false;
    }
  }
  renderPanel() {
    switch (this.props.step) {
    case MONITOR_STEPS.WELCOME:
      return <WelcomePanel />;
    case MONITOR_STEPS.PLANNING:
      return <PlanningPanel
        dateLastPause={this.props.dateLastPause}
        taskChrono={this.props.taskChrono}
        currentTrelloCard={this.props.currentTrelloCard}
        handlePlanningPanelChange={(fieldsToUpdate) => this.updateMonitorState(fieldsToUpdate)} />;
    case MONITOR_STEPS.WORKFLOW:
      return (
        <Grid className="Monitor-task-container" container spacing={0}>
          <Grid item xs={8} lg={9} className="Monitor-FullHeightPanel">
            <TaskPanel
              dateLastPause={this.props.dateLastPause}
              taskChrono={this.props.taskChrono}
              currentTask={this.props.tasks[this.props.currentTaskIndex]}
              handleTaskPanelChange={(fieldsToUpdate) => this.updateMonitorState(fieldsToUpdate)} />
          </Grid>
          <Grid item xs={4} lg={3} className="Monitor-FullHeightPanel">
            <TasksLateralPanel
              tasks={this.props.tasks}
              currentTaskIndex={this.props.currentTaskIndex} />
          </Grid>
        </Grid>
      );
    case MONITOR_STEPS.RESULTS:
      return <ResultPanel results={this.props.tasks} currentTrelloCard={this.props.currentTrelloCard}/>;
    default:
      break;
    }
  }
  renderPlayPauseButton() {
    return this.props.step === MONITOR_STEPS.PLANNING || this.props.step === MONITOR_STEPS.WORKFLOW ?
      <Button raised className="Monitor-footer-button" onClick={this.props.playOrPauseSession} >
        {this.props.dateLastPause ? 'PLAY' : 'PAUSE'} (spacebar)
      </Button>
      : null;
  }
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header">
          <Chrono chrono={this.props.taskChrono} dateLastPause={this.props.dateLastPause}/>
          {
            this.props.currentTrelloCard ?
              <p>#{this.props.currentTrelloCard.idShort} {this.props.currentTrelloCard.name}</p>
              : ''
          }
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
    tasks: state.MonitorReducers.tasks,
    currentTaskIndex: state.MonitorReducers.currentTaskIndex,
    results: state.MonitorReducers.results,
    taskChrono: state.MonitorReducers.taskChrono,
    globalChrono: state.MonitorReducers.globalChrono,
    dateLastPause: state.MonitorReducers.dateLastPause,
    currentTrelloCard: state.MonitorReducers.currentTrelloCard,
    projectId: state.SettingsReducers.selectedProjectId ? state.SettingsReducers.selectedProjectId : '',
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
    goToHome: () => {
      window.location.hash = '#/';
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
