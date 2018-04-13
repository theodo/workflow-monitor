import uuid from 'uuid';
import { INIT_SESSION, NEXT_TASK, START_SESSION, PLAY_OR_PAUSE_SESSION, RESET_MONITOR } from './MonitorActions';
import { MONITOR_STEPS } from './Monitor';
import { sendEvent } from '../../Utils/AnalyticsUtils';

const calculateElapsedTime = (chrono, dateLastPause) => {
  return chrono.elapsedTime + (dateLastPause - chrono.dateLastStart);
};

const calculateCurrentTaskTime = (taskChrono, now) => {
  return taskChrono.elapsedTime + (now - taskChrono.dateLastStart);
};

const saveAnalytics = (tasks, projectId) => {
  sendEvent('Ticket','finish',`${projectId}`);

  const allTasks = tasks ? tasks : [];
  const problemCounter = allTasks.filter(task => task.problems && task.problems.length > 0 ).length;
  if(problemCounter > 0) sendEvent('Problems','detect',`${projectId}`, problemCounter);

  const planningErrorCounter = allTasks.filter(task => task.addedOnTheFly ).length;
  if(planningErrorCounter > 0) sendEvent('Planning','error',`${projectId}`, planningErrorCounter);

  const checkCounter = allTasks.filter(task => task.check && task.check.length > 0 ).length;
  if(checkCounter > 0) sendEvent('Check','add',`${projectId}`, checkCounter);
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

const oldState = (JSON.parse(localStorage.getItem('monitorState')));

const currentInitialState = localStorage.getItem('monitorState') ? oldState : initialMonitorState;

const MonitorReducers = (state = currentInitialState, action) => {
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
      tasks: [{id: uuid(), label: 'Planning', realTime: calculateCurrentTaskTime(state.taskChrono, now) }, ...action.tasks],
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
      saveAnalytics(newStateForNextTask.tasks, action.projectId);
      newStateForNextTask.currentStep = MONITOR_STEPS.RESULTS;
      newStateForNextTask.dateLastPause = now;
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
  default:
    newState = state;
  }
  localStorage.setItem('monitorState', JSON.stringify(newState));
  return newState;
};

export default MonitorReducers;
