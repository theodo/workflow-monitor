import { INIT_SESSION, NEXT_TASK, START_SESSION, PLAY_OR_PAUSE_SESSION, RESET_MONITOR } from './MonitorActions';
import { MONITOR_STEPS } from './Monitor'

const initialMonitorState = {
  isSessionPaused: false,
  currentStep: MONITOR_STEPS.WELCOME,
  results: [],
  tasks: [],
  currentTaskIndex: 0,
}

const MonitorReducers = (state = initialMonitorState, action) => {
  switch (action.type) {
    case INIT_SESSION:
      return {
        ...state,
        currentStep: MONITOR_STEPS.PLANNING,
        results: [],
        tasks: [],
        currentTaskIndex: 0,
      }
    case START_SESSION:
      return {
        ...state,
        currentStep: MONITOR_STEPS.WORKFLOW,
        results: [{ label: 'Planning', realTime: action.planningRealTime }],
        tasks: action.tasks,
      }
    case NEXT_TASK:
      const result = {
        ...state.tasks[state.currentTaskIndex],
        problems: action.taskProblems,
        realTime: action.taskRealTime,
      }

      let newState = {
        ...state,
        results: [...state.results, result],
        currentTaskIndex: state.currentTaskIndex + 1,
      }

      if (action.newTasks && action.newTasks.length > 0) {
        newState.tasks = [
          ...state.tasks.slice(0,state.currentTaskIndex+1),
          ...action.newTasks,
          ...state.tasks.slice(state.currentTaskIndex+1),
        ]
      }

      if((!action.newTasks || action.newTasks.length === 0)
        && state.currentTaskIndex >= state.tasks.length - 1) {
        newState.currentStep = MONITOR_STEPS.RESULTS
      }
      return newState
    case RESET_MONITOR:
      return { ...initialMonitorState }
    case PLAY_OR_PAUSE_SESSION:
      return { ...state, isSessionPaused: !state.isSessionPaused }
    default:
      return state
  }
}

export default MonitorReducers
