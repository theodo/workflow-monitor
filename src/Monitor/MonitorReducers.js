import { INIT_SESSION, NEXT_TASK, START_SESSION, PLAY_OR_PAUSE_SESSION, RESET_MONITOR } from './MonitorActions';
import { MONITOR_STEPS } from './Monitor'

const initialMonitorState = {
  isSessionPaused: false,
  currentStep: MONITOR_STEPS.WELCOME,
  results: [],
  tasks: [],
  currentTaskIndex: 0,
};

const oldState = (JSON.parse(localStorage.getItem('monitorState')));

const currentInitialState = localStorage.getItem('monitorState') ? oldState : initialMonitorState;

const MonitorReducers = (state = currentInitialState, action) => {
  let newState = {};
  switch (action.type) {
    case INIT_SESSION:
      newState = {
        ...state,
        currentStep: MONITOR_STEPS.PLANNING,
        results: [],
        tasks: [],
        currentTaskIndex: 0,
      }
      break;
    case START_SESSION:
      newState = {
        ...state,
        currentStep: MONITOR_STEPS.WORKFLOW,
        results: [{ label: 'Planning', realTime: action.planningRealTime }],
        tasks: action.tasks,
      }
      break;
    case NEXT_TASK:
      const result = {
        ...state.tasks[state.currentTaskIndex],
        problems: action.taskProblems,
        realTime: action.taskRealTime,
      }

      let newStateForNextTask = {
        ...state,
        results: [...state.results, result],
        currentTaskIndex: state.currentTaskIndex + 1,
      }

      if (action.newTasks && action.newTasks.length > 0) {
        newStateForNextTask.tasks = [
          ...state.tasks.slice(0,state.currentTaskIndex+1),
          ...action.newTasks,
          ...state.tasks.slice(state.currentTaskIndex+1),
        ]
      }

      if((!action.newTasks || action.newTasks.length === 0)
        && state.currentTaskIndex >= state.tasks.length - 1) {
        newStateForNextTask.currentStep = MONITOR_STEPS.RESULTS
      }
      newState = newStateForNextTask
      break;
    case RESET_MONITOR:
      newState = { ...initialMonitorState }
      break;
    case PLAY_OR_PAUSE_SESSION:
      newState = { ...state, isSessionPaused: !state.isSessionPaused }
      break;
    default:
      newState = state
    }
    localStorage.setItem('monitorState', JSON.stringify(newState));
    return newState;
}

export default MonitorReducers
