import { INIT_SESSION, NEXT_TASK, START_SESSION, PLAY_OR_PAUSE_SESSION, RESET_MONITOR } from './MonitorActions';
import { MONITOR_STEPS } from './Monitor'

const calculateElapsedTime = (chrono, dateLastPause) => {
  return chrono.elapsedTime + (dateLastPause - chrono.dateLastStart)
};

const calculateCurrentTaskTime = (taskChrono, now) => {
  return taskChrono.elapsedTime + (now - taskChrono.dateLastStart)
};

const initialMonitorState = {
  isSessionPaused: false,
  currentStep: MONITOR_STEPS.WELCOME,
  results: [],
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
  }
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
        results: [],
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
      }
      break;
    case START_SESSION:
      newState = {
        ...state,
        currentStep: MONITOR_STEPS.WORKFLOW,
        results: [{ label: 'Planning', realTime: calculateCurrentTaskTime(state.taskChrono, now) }],
        tasks: action.tasks,
        taskChrono: {
          dateLastStart: now,
          elapsedTime: 0,
        },
      }
      break;
    case NEXT_TASK:
      const result = {
        ...state.tasks[state.currentTaskIndex],
        problems: action.taskProblems,
        realTime: calculateCurrentTaskTime(state.taskChrono, now),
      }

      let newStateForNextTask = {
        ...state,
        results: [...state.results, result],
        currentTaskIndex: state.currentTaskIndex + 1,
        taskChrono: {
          dateLastStart: now,
          elapsedTime: 0,
        },
      }

      if (action.newTasks && action.newTasks.length > 0) {
        newStateForNextTask.tasks = [
          ...state.tasks.slice(0,state.currentTaskIndex+1),
          ...action.newTasks,
          ...state.tasks.slice(state.currentTaskIndex+1),
        ]
        // We re-assign ids
        newStateForNextTask.tasks = newStateForNextTask.tasks.map((task, index) => ({ ...task, id: index + 1}));
      }

      if((!action.newTasks || action.newTasks.length === 0)
        && state.currentTaskIndex >= state.tasks.length - 1) {
        newStateForNextTask.currentStep = MONITOR_STEPS.RESULTS;
        newStateForNextTask.dateLastPause = now;
      }
      newState = newStateForNextTask
      break;
    case RESET_MONITOR:
      newState = { ...initialMonitorState }
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
        }
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
        }
      }
      break;
    default:
      newState = state
    }
    localStorage.setItem('monitorState', JSON.stringify(newState));
    return newState;
}

export default MonitorReducers
