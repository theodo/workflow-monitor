import { UPDATE_CURRENT_STATE } from 'Queries/Tickets';
import uuid from 'uuid';

import { sendEvent } from 'Utils/AnalyticsUtils';
import { gqlClient } from 'Utils/Graphql';

import {
  INIT_SESSION,
  NEXT_TASK,
  PREVIOUS_TASK,
  START_SESSION,
  PLAY_OR_PAUSE_SESSION,
  RESET_MONITOR,
  UPDATE,
  BACK_TO_PLANNING,
  SET_CURRENT_TASK_FIELDS,
  SET_TICKET_ID,
  UPDATE_TASK_TIMER,
} from './MonitorActions';
import { MONITOR_STEPS } from './Monitor';

const calculateElapsedTime = (chrono, dateLastPause) => {
  return chrono.elapsedTime + (dateLastPause - chrono.dateLastStart);
};

const calculateCurrentTaskTime = (taskChrono, now) => {
  return taskChrono.elapsedTime + (now - taskChrono.dateLastStart);
};

const saveAnalytics = (tasks, projectId) => {
  sendEvent('Ticket', 'finish', `${projectId}`);

  const allTasks = tasks ? tasks : [];
  const problemCounter = allTasks.filter(task => task.problems && task.problems.length > 0).length;
  if (problemCounter > 0) sendEvent('Problems', 'detect', `${projectId}`, problemCounter);

  const planningErrorCounter = allTasks.filter(task => task.addedOnTheFly).length;
  if (planningErrorCounter > 0)
    sendEvent('Planning', 'error', `${projectId}`, planningErrorCounter);

  const checkCounter = allTasks.filter(task => task.check && task.check.length > 0).length;
  if (checkCounter > 0) sendEvent('Check', 'add', `${projectId}`, checkCounter);
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

const oldState = JSON.parse(localStorage.getItem('monitorState'));

const currentInitialState = localStorage.getItem('monitorState') ? oldState : initialMonitorState;

const updateTask = (state, taskIndex, newFields) => {
  let taskToUpdate = state.tasks[taskIndex];
  taskToUpdate = {
    ...taskToUpdate,
    ...newFields,
  };

  let tasks = state.tasks;
  tasks[taskIndex] = taskToUpdate;
  tasks = [...tasks];

  return {
    ...state,
    tasks,
  };
};

const MonitorReducers = (state = currentInitialState, action) => {
  let newState = {};
  const now = new Date().getTime();
  switch (action.type) {
    case INIT_SESSION:
      localStorage.removeItem('planningTasks');
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
        },
      };
      break;
    case START_SESSION:
      newState = {
        ...state,
        currentStep: MONITOR_STEPS.WORKFLOW,
        tasks: [
          {
            id: uuid(),
            description: 'Planning',
            realTime: calculateCurrentTaskTime(state.taskChrono, now),
          },
          ...action.tasks,
        ],
        currentTaskIndex: 1,
        taskChrono: {
          dateLastStart: now,
          elapsedTime: 0,
        },
      };
      break;
    case BACK_TO_PLANNING:
      newState = {
        ...state,
        currentStep: MONITOR_STEPS.PLANNING,
        tasks: state.tasks.map(task => task),
        currentTaskIndex: 0,
      };
      break;
    case NEXT_TASK: {
      const result = {
        ...state.tasks[state.currentTaskIndex],
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
          ...state.tasks.slice(0, state.currentTaskIndex + 1),
          ...action.newTasks,
          ...state.tasks.slice(state.currentTaskIndex + 1),
        ];
      }
      if (
        (!action.newTasks || action.newTasks.length === 0) &&
        state.currentTaskIndex >= state.tasks.length - 1
      ) {
        saveAnalytics(newStateForNextTask.tasks, action.projectId);
        newStateForNextTask.currentStep = MONITOR_STEPS.RESULTS;
        newStateForNextTask.dateLastPause = now;
      } else {
        const nextStepRealTime = newStateForNextTask.tasks[state.currentTaskIndex + 1].realTime;
        newStateForNextTask.taskChrono.elapsedTime = nextStepRealTime || 0;
      }
      newState = newStateForNextTask;
      break;
    }
    case PREVIOUS_TASK: {
      let newStateForPreviousTask = {
        ...state,
        currentTaskIndex: state.currentTaskIndex - 1,
        taskChrono: {
          dateLastStart: now,
          elapsedTime: state.tasks[state.currentTaskIndex - 1].realTime,
        },
      };

      if (state.currentStep === MONITOR_STEPS.WORKFLOW) {
        const result = {
          ...state.tasks[state.currentTaskIndex],
          realTime: calculateCurrentTaskTime(state.taskChrono, now),
        };

        const tasks = state.tasks;
        tasks[state.currentTaskIndex] = result;

        newStateForPreviousTask = {
          ...newStateForPreviousTask,
          tasks,
        };

        if (action.newTasks && action.newTasks.length > 0) {
          newStateForPreviousTask.tasks = [
            ...state.tasks.slice(0, state.currentTaskIndex + 1),
            ...action.newTasks,
            ...state.tasks.slice(state.currentTaskIndex + 1),
          ];
        }
      }
      if (state.currentStep === MONITOR_STEPS.RESULTS) {
        newStateForPreviousTask = {
          ...newStateForPreviousTask,
          currentStep: MONITOR_STEPS.WORKFLOW,
          dateLastPause: undefined,
          globalChrono: {
            dateLastStart: now,
            elapsedTime: calculateElapsedTime(state.globalChrono, state.dateLastPause),
          },
        };
      }
      newState = newStateForPreviousTask;
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
          },
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
          },
        };
      }
      break;
    case UPDATE_TASK_TIMER:
      newState = {
        ...state,
        taskChrono: {
          ...state.taskChrono,
          elapsedTime: state.taskChrono.elapsedTime - action.delta,
        },
        globalChrono: {
          ...state.globalChrono,
          elapsedTime: state.globalChrono.elapsedTime - action.delta,
        },
      };
      break;
    case UPDATE:
      newState = action.state;
      break;
    case SET_TICKET_ID:
      newState = {
        ...state,
        ticketId: action.ticketId,
      };
      break;
    case SET_CURRENT_TASK_FIELDS:
      newState = updateTask(state, state.currentTaskIndex, action.fields);
      break;
    default:
      newState = state;
  }
  localStorage.setItem('monitorState', JSON.stringify(newState));
  if (action.type !== UPDATE && action.type !== SET_CURRENT_TASK_FIELDS) {
    gqlClient
      .mutate({
        mutation: UPDATE_CURRENT_STATE,
        variables: {
          state: JSON.stringify(newState),
        },
      })
      .then(() => {});
  }
  return newState;
};

export default MonitorReducers;
