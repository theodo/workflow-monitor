const uuid = require('uuid');
const { INIT_SESSION, NEXT_TASK, PREVIOUS_TASK, START_SESSION, PLAY_OR_PAUSE_SESSION, RESET_MONITOR, UPDATE } = require('./MonitorActions');
const axios = require('axios');
const { gqlClient } = require('./api');
const gql = require('graphql-tag');

const MONITOR_STEPS = {
  WELCOME: 'WELCOME',
  PLANNING: 'PLANNING',
  WORKFLOW: 'WORKFLOW',
  RESULTS: 'RESULTS',
};

const calculateElapsedTime = (chrono, dateLastPause) => {
  return chrono.elapsedTime + (dateLastPause - chrono.dateLastStart);
};

const calculateCurrentTaskTime = (taskChrono, now) => {
  return taskChrono.elapsedTime + (now - taskChrono.dateLastStart);
};

const initialMonitorState = {
  isSessionPaused: false,
  currentStep: MONITOR_STEPS.WELCOME,
  tasks: [],
  currentTaskIndex: 0,
  dateLastPause: undefined,
  taskChrono: {
    dateLastStart: undefined,
    elapsedTime: 0,
  },
  globalChrono: {
    dateLastStart: undefined,
    elapsedTime: 0,
  },
  currentTrelloCard: undefined,
};

const MonitorReducers = (state = initialMonitorState, action) => {
  if(!action) return state;
  let newState = {};
  const now = (new Date()).getTime();
  switch (action.type) {
  case INIT_SESSION:
    newState = {
      ...state,
      currentStep: MONITOR_STEPS.PLANNING,
      tasks: [],
      currentTaskIndex: 0,
      dateLastPause: undefined,
      taskChrono: {
        dateLastStart: now,
        elapsedTime: 0,
      },
      globalChrono: {
        dateLastStart: now,
        elapsedTime: 0,
      }
    };
    break;
  case START_SESSION:
    newState = {
      ...state,
      currentStep: MONITOR_STEPS.WORKFLOW,
      tasks: [{id: uuid(), description: 'Planning', realTime: calculateCurrentTaskTime(state.taskChrono, now) }, ...action.tasks],
      currentTaskIndex: 1,
      taskChrono: {
        dateLastStart: now,
        elapsedTime: 0,
      },
    };
    break;
  case NEXT_TASK: {
    const result = {
      ...state.tasks[state.currentTaskIndex],
      problems: action.taskProblems,
      realTime: calculateCurrentTaskTime(state.taskChrono, now),
    };

    const tasks = state.tasks;
    tasks[state.currentTaskIndex] = result;

    let newStateForNextTask = {
      ...state,
      tasks,
      currentTaskIndex: state.currentTaskIndex + 1,
      taskChrono: {
        dateLastStart: now,
        elapsedTime: 0,
      },
    };

    if (action.newTasks && action.newTasks.length > 0) {
      newStateForNextTask.tasks = [
        ...state.tasks.slice(0,state.currentTaskIndex+1),
        ...action.newTasks,
        ...state.tasks.slice(state.currentTaskIndex+1),
      ];
    }
    if((!action.newTasks || action.newTasks.length === 0)
        && state.currentTaskIndex >= state.tasks.length - 1) {
      newStateForNextTask.currentStep = MONITOR_STEPS.RESULTS;
      newStateForNextTask.dateLastPause = now;
    } else {
      const nextStepRealTime = newStateForNextTask.tasks[state.currentTaskIndex + 1].realTime;
      newStateForNextTask.taskChrono.elapsedTime =  nextStepRealTime || 0;
    }
    newState = newStateForNextTask;
    break;
  }
  case PREVIOUS_TASK: {
    const result = {
      ...state.tasks[state.currentTaskIndex],
      problems: action.taskProblems,
      realTime: calculateCurrentTaskTime(state.taskChrono, now),
    };

    const tasks = state.tasks;
    tasks[state.currentTaskIndex] = result;

    let newStateForNextTask = {
      ...state,
      tasks,
      currentTaskIndex: state.currentTaskIndex - 1,
      taskChrono: {
        dateLastStart: now,
        elapsedTime: tasks[state.currentTaskIndex - 1].realTime,
      },
    };

    if (action.newTasks && action.newTasks.length > 0) {
      newStateForNextTask.tasks = [
        ...state.tasks.slice(0,state.currentTaskIndex+1),
        ...action.newTasks,
        ...state.tasks.slice(state.currentTaskIndex+1),
      ];
    }
    newState = newStateForNextTask;
    break;
  }
  case RESET_MONITOR:
    newState = {
      ...initialMonitorState,
      currentTrelloCard: action.card,
    };
    break;
  case PLAY_OR_PAUSE_SESSION:
    if (state.dateLastPause) {
      newState = {
        ...state,
        dateLastPause: undefined,
        taskChrono: {
          dateLastStart: now,
          elapsedTime: calculateElapsedTime(state.taskChrono, state.dateLastPause),
        },
        globalChrono: {
          dateLastStart: now,
          elapsedTime: calculateElapsedTime(state.globalChrono, state.dateLastPause),
        }
      };
    } else {
      newState = {
        ...state,
        dateLastPause: now,
        taskChrono: {
          dateLastStart: state.taskChrono.dateLastStart,
          elapsedTime: state.taskChrono.elapsedTime,
        },
        globalChrono: {
          dateLastStart: state.globalChrono.dateLastStart,
          elapsedTime: state.globalChrono.elapsedTime,
        }
      };
    }
    break;
  case UPDATE:
    newState = action.state;
    break;
  default:
    newState = state;
  }
  if (action.type !== UPDATE) {
    gqlClient
      .mutate({
        mutation: gql`
          mutation {
            updateCurrentState(state:${JSON.stringify(JSON.stringify(newState))})
          }
        `,
      })
      .then(() => {});
    }
  return newState;
};

module.exports = MonitorReducers
