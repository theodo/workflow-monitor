import React, { Component } from 'react';
import gql from 'graphql-tag';
import { gqlClient } from 'Utils/Graphql';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import LinkIcon from '@material-ui/icons/Link';
import PauseIcon from '@material-ui/icons/Pause';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import { subscriptionClient } from 'Utils/Graphql';

import {
  initSession,
  nextTask,
  previousTask,
  startSession,
  playOrPauseSession,
  update,
  backToPlanning,
  setCurrentTaskFields,
  setTicketId,
} from './MonitorActions';
import { currentTaskSelector } from './MonitorSelectors';
import Chrono from './Chrono/Chrono';
import PlanningPanel from './PlanningPanel/PlanningPanel';
import ResultPanel from './ResultPanel';
import TaskPanel from './TaskPanel/TaskPanel';
import TasksLateralPanel from './TasksLateralPanel/TasksLateralPanel';
import TicketStartPanel from './TicketStartPanel';
import MuteAlarmButton from './Footer/MuteAlarmButton/MuteAlarmButton';
import './Monitor.css';

export const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};

function findAncestorWithClass(el, cls) {
  while (!el.classList.contains(cls) && (el = el.parentElement));
  return el;
}

class Footer extends Component {
  constructor(props) {
    super(props);
    this.handlePauseClick = this.handlePauseClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }
  handlePauseClick(event) {
    const button = findAncestorWithClass(event.target, 'Monitor-footer-button');
    button.blur();
    this.props.onPauseClick();
  }
  handleNextClick(event) {
    const button = findAncestorWithClass(event.target, 'Monitor-footer-button');
    button.blur();
    this.props.onNextClick();
  }
  handlePreviousClick(event) {
    const button = findAncestorWithClass(event.target, 'Monitor-footer-button');
    button.blur();
    this.props.onPreviousClick();
  }
  renderPlayPauseButton() {
    return this.props.step === MONITOR_STEPS.PLANNING ||
      this.props.step === MONITOR_STEPS.WORKFLOW ? (
      <IconButton
        className="Monitor-footer-button"
        aria-label="play/pause"
        color="primary"
        tabIndex="-1"
        onClick={this.handlePauseClick}
      >
        {this.props.dateLastPause ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
    ) : null;
  }
  render() {
    return (
      <div>
        <LinearProgress variant="determinate" value={this.props.progressPercentage} />
        <footer className="Monitor-footer">
          <div className="Monitor-footer-bloc">
            <IconButton
              aria-label="Previous"
              className="Monitor-footer-button"
              color="primary"
              disabled={this.props.isPreviousDisabled}
              tabIndex="-1"
              onClick={this.handlePreviousClick}
            >
              <SkipPreviousIcon />
            </IconButton>
            <MuteAlarmButton />
          </div>
          <div className="Monitor-footer-bloc">{this.renderPlayPauseButton()}</div>
          <div className="Monitor-footer-bloc">
            <IconButton
              aria-label="Next"
              className="Monitor-footer-button"
              color="primary"
              disabled={this.props.isNextDisabled}
              tabIndex="-1"
              onClick={this.handleNextClick}
            >
              <SkipNextIcon />
            </IconButton>
          </div>
        </footer>
      </div>
    );
  }
}

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getProgressPercentage = this.getProgressPercentage.bind(this);
    document.onkeypress = this.handleKeyPress;
    this.state = {
      planningPanelChanges: {
        tasks: [],
      },
      taskPanelChanges: {
        newTasks: [],
        currentTaskCheckOK: false,
      },
    };
    subscriptionClient
      .subscribe({
        query: gql`
          subscription {
            state
          }
        `,
        variables: {},
      })
      .subscribe(
        {
          next(data) {
            props.update(JSON.parse(data.state));
          },
        },
        () => console.log('error'),
      );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.step === MONITOR_STEPS.WORKFLOW && this.props.step === MONITOR_STEPS.RESULTS) {
      console.log('prevProps', prevProps);
      console.log('props', this.props);
      gqlClient
        .mutate({
          mutation: gql`
        mutation {
          saveTicket(state:${JSON.stringify(JSON.stringify(this.props.monitorState))})
        }
        `,
        })
        .then(result => {
          this.props.setTicketId(result.data.saveTicket);
        });
    }
  }

  getProgressPercentage() {
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        return 0;
      case MONITOR_STEPS.PLANNING:
        return 0;
      case MONITOR_STEPS.WORKFLOW:
        return (this.props.currentTaskIndex * 100) / this.props.tasks.length;
      case MONITOR_STEPS.RESULTS:
        return 100;
      default:
        break;
    }
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
    if (this.isNextButtonDisabled()) return;

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
    if (this.isPreviousButtonDisabled()) return;
    if (this.props.currentTaskIndex === 1) {
      if (
        window.confirm(
          'Are you sure you want to go back to planning ? Your current session will be deleted.',
        )
      )
        this.props.backToPlanning();
    } else this.goToPreviousTask();
  }
  initSession() {
    this.props.initSession();
  }
  startTask() {
    this.setState({
      taskPanelChanges: {
        newTasks: [],
        currentTaskCheckOK: false,
      },
    });
  }
  startSession() {
    this.props.startSession(this.state.planningPanelChanges.tasks);
    this.startTask();
  }
  goToNextTask() {
    this.props.nextTask(
      this.state.taskPanelChanges.newTasks,
      this.state.taskPanelChanges.problems,
      this.props.projectId,
    );
    this.startTask();
  }
  goToPreviousTask() {
    this.props.previousTask(
      this.state.taskPanelChanges.newTasks,
      this.state.taskPanelChanges.problems,
    );
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
        return (
          !this.areTasksValid(this.state.planningPanelChanges.tasks) ||
          this.props.dateLastPause !== undefined
        );
      case MONITOR_STEPS.WORKFLOW: {
        const { currentTask } = this.props;

        return (
          this.props.dateLastPause !== undefined ||
          (currentTask.check &&
            currentTask.check.length > 0 &&
            !this.state.taskPanelChanges.currentTaskCheckOK)
        );
      }
      default:
        return false;
    }
  }
  isPreviousButtonDisabled() {
    if (this.props.step === MONITOR_STEPS.RESULTS) return false;
    return this.props.step !== MONITOR_STEPS.WORKFLOW || this.props.dateLastPause !== undefined;
  }
  renderPanel() {
    switch (this.props.step) {
      case MONITOR_STEPS.WELCOME:
        return <TicketStartPanel />;
      case MONITOR_STEPS.PLANNING:
        return (
          <PlanningPanel
            dateLastPause={this.props.dateLastPause}
            taskChrono={this.props.taskChrono}
            currentTrelloCard={this.props.currentTrelloCard}
            handlePlanningPanelChange={fieldsToUpdate => this.updateMonitorState(fieldsToUpdate)}
          />
        );
      case MONITOR_STEPS.WORKFLOW:
        return (
          <Grid className="Monitor-task-container" container spacing={0}>
            <Grid item xs={8} lg={9} className="Monitor-FullHeightPanel">
              <TaskPanel
                dateLastPause={this.props.dateLastPause}
                taskChrono={this.props.taskChrono}
                currentTask={this.props.currentTask}
                handleCurrentTaskChange={this.props.handleCurrentTaskChange}
                handleTaskPanelChange={fieldsToUpdate => this.updateMonitorState(fieldsToUpdate)}
              />
            </Grid>
            <Grid item xs={4} lg={3} className="Monitor-FullHeightPanel Monitor-padding-left">
              <TasksLateralPanel
                tasks={this.props.tasks}
                currentTaskIndex={this.props.currentTaskIndex}
                taskChrono={this.props.taskChrono}
                dateLastPause={this.props.dateLastPause}
              />
            </Grid>
          </Grid>
        );
      case MONITOR_STEPS.RESULTS:
        return <ResultPanel currentTrelloCard={this.props.currentTrelloCard} />;
      default:
        break;
    }
  }
  render() {
    return (
      <div className="Monitor">
        <header className="Monitor-header no-print">
          <Grid container spacing={0}>
            <Grid item xs={8} lg={9} className="Monitor-header-centered-text">
              {this.props.currentTrelloCard ? (
                <a
                  href={this.props.currentTrelloCard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Monitor-header-link"
                >
                  #{this.props.currentTrelloCard.idShort} {this.props.currentTrelloCard.name}{' '}
                  <LinkIcon />
                </a>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={4} lg={3} className="Monitor-header-centered-text">
              <span>
                {'TOTAL '}
                <Chrono chrono={this.props.globalChrono} dateLastPause={this.props.dateLastPause} />
                "
              </span>
            </Grid>
          </Grid>
        </header>
        <div className="Monitor-content">{this.renderPanel()}</div>
        <div className="no-print">
          <Footer
            step={this.props.step}
            isNextDisabled={this.isNextButtonDisabled()}
            isPreviousDisabled={this.isPreviousButtonDisabled()}
            onPauseClick={() => this.props.playOrPauseSession()}
            onNextClick={() => this.handleClickNextButton()}
            onPreviousClick={() => this.handleClickPreviousButton()}
            progressPercentage={this.getProgressPercentage()}
            dateLastPause={this.props.dateLastPause}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    monitorState: state.MonitorReducers,
    isSessionPaused: state.MonitorReducers.isSessionPaused,
    step: state.MonitorReducers.currentStep,
    tasks: state.MonitorReducers.tasks,
    currentTaskIndex: state.MonitorReducers.currentTaskIndex,
    currentTask: currentTaskSelector(state.MonitorReducers),
    taskChrono: state.MonitorReducers.taskChrono,
    globalChrono: state.MonitorReducers.globalChrono,
    dateLastPause: state.MonitorReducers.dateLastPause,
    currentTrelloCard: state.MonitorReducers.currentTrelloCard,
    projectId: state.SettingsReducers.selectedProjectId
      ? state.SettingsReducers.selectedProjectId
      : '',
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
    backToPlanning: () => {
      dispatch(backToPlanning());
    },
    startSession: (tasks, planningRealTime) => {
      dispatch(startSession(tasks, planningRealTime));
    },
    nextTask: (newTasks, projectId) => {
      dispatch(nextTask(newTasks, projectId));
    },
    previousTask: newTasks => {
      dispatch(previousTask(newTasks));
    },
    update: newState => {
      dispatch(update(newState));
    },
    handleCurrentTaskChange: fields => {
      dispatch(setCurrentTaskFields(fields));
    },
    goToHome: () => {
      window.location.hash = '#/';
    },
    setTicketId: ticketId => {
      dispatch(setTicketId(ticketId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Monitor);
