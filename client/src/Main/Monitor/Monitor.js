import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { initSession, nextTask, previousTask, startSession, playOrPauseSession } from './MonitorActions';
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

class Footer extends Component {
  constructor(props){
    super(props);
    this.handlePauseClick = this.handlePauseClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }
  getNextButtonLabel(){
    switch (this.props.step) {
    case MONITOR_STEPS.WELCOME:
      return 'START';
    case MONITOR_STEPS.RESULTS:
      return 'NEW TICKET';
    default:
      return 'NEXT';
    }
  }
  handlePauseClick(event) {
    event.target.blur();
    this.props.onPauseClick();
  }
  handleNextClick(event) {
    event.target.blur();
    this.props.onNextClick();
  }
  handlePreviousClick(event) {
    event.target.blur();
    this.props.onPreviousClick();
  }
  renderPlayPauseButton() {
    return this.props.step === MONITOR_STEPS.PLANNING || this.props.step === MONITOR_STEPS.WORKFLOW ?
      <Button raised className="Monitor-footer-button" onClick={this.handlePauseClick} tabIndex="-1">
        {this.props.dateLastPause ? 'PLAY' : 'PAUSE'} (spacebar)
      </Button>
      : null;
  }
  render() {
    return (
      <footer className="Monitor-footer">
        <div className="Monitor-footer-bloc">
          <Button raised className="Monitor-footer-button" disabled={this.props.isPreviousDisabled} tabIndex="-1" onClick={this.handlePreviousClick}>
            Previous (p)
          </Button>
        </div>
        <div className="Monitor-footer-bloc">
          {this.renderPlayPauseButton()}
        </div>
        <div className="Monitor-footer-bloc">
          <Button raised className="Monitor-footer-button" disabled={this.props.isNextDisabled} onClick={this.handleNextClick} tabIndex="-1">
            {this.getNextButtonLabel()} (n)
          </Button>
        </div>
      </footer>
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
      this.handleClickNextButton();
    } else if (event.which === 112) {
      this.handleClickPreviousButton();
    } else if (event.which === 32) {
      this.props.playOrPauseSession();
    }
  }
  handleClickNextButton() {
    if(this.isNextButtonDisabled()) return;

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
  handleClickPreviousButton() {
    if(this.isPreviousButtonDisabled()) return;

    this.goToPreviousTask();
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
  goToPreviousTask() {
    this.props.previousTask(this.state.taskPanelChanges.newTasks, this.state.taskPanelChanges.problems);
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
  isNextButtonDisabled() {
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
  isPreviousButtonDisabled() {
    return this.props.step !== MONITOR_STEPS.WORKFLOW || this.props.dateLastPause !== undefined || this.props.currentTaskIndex < 2;
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
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header">
          <Chrono chrono={this.props.taskChrono} dateLastPause={this.props.dateLastPause}/>
          {
            this.props.currentTrelloCard ?
              <a href={this.props.currentTrelloCard.url} target="_blank" className="Monitor-header-link">
                #{this.props.currentTrelloCard.idShort} {this.props.currentTrelloCard.name}
              </a>
              : ''
          }
          <Chrono chrono={this.props.globalChrono} dateLastPause={this.props.dateLastPause}/>
        </header>
        <div className="Monitor-content">
          { this.renderPanel() }
        </div>
        <Footer
          step={this.props.step}
          isNextDisabled={this.isNextButtonDisabled()}
          isPreviousDisabled={this.isPreviousButtonDisabled()}
          onPauseClick={() => this.props.playOrPauseSession()}
          onNextClick={() => this.handleClickNextButton()}
          onPreviousClick={() => this.handleClickPreviousButton()}
        />
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
    nextTask: (newTasks, taskProblem, projectId) => {
      dispatch(nextTask(newTasks, taskProblem, projectId));
    },
    previousTask: (newTasks, taskProblem) => {
      dispatch(previousTask(newTasks, taskProblem));
    },
    goToHome: () => {
      window.location.hash = '#/';
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
