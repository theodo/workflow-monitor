export const INIT_SESSION = 'INIT_SESSION';
export const START_SESSION = 'START_SESSION';
export const NEXT_TASK = 'NEXT_TASK';
export const PREVIOUS_TASK = 'PREVIOUS_TASK';
export const RESET_MONITOR = 'RESET_MONITOR';
export const PLAY_OR_PAUSE_SESSION = 'PLAY_OR_PAUSE_SESSION';
export const UPDATE_TASK_TIMER = 'UPDATE_TASK_TIMER';
export const BACK_TO_PLANNING = 'BACK_TO_PLANNING';
export const SET_CURRENT_TASK_FIELDS = 'SET_CURRENT_TASK_FIELDS';
export const UPDATE = 'UPDATE';
export const SET_TICKET_ID = 'SET_TICKET_ID';
export const UPDATE_MONITOR_STATE = 'UPDATE_MONITOR_STATE';

export function initSession() {
  return {
    type: INIT_SESSION,
  };
}

export function startSession(tasks) {
  return {
    type: START_SESSION,
    tasks,
  };
}

export function nextTask(newTasks, projectId) {
  return {
    type: NEXT_TASK,
    newTasks,
    projectId,
  };
}

export function previousTask(newTasks) {
  return {
    type: PREVIOUS_TASK,
    newTasks,
  };
}

export function playOrPauseSession() {
  return {
    type: PLAY_OR_PAUSE_SESSION,
  };
}

export function updateTaskTimer(delta) {
  return {
    type: UPDATE_TASK_TIMER,
    delta,
  };
}

export function resetMonitor(card) {
  return {
    type: RESET_MONITOR,
    card,
  };
}

export function backToPlanning() {
  return {
    type: BACK_TO_PLANNING,
  };
}

export function setCurrentTaskFields(fields) {
  return {
    type: SET_CURRENT_TASK_FIELDS,
    fields,
  };
}

export function updateMonitorState(fields) {
  return {
    type: UPDATE_MONITOR_STATE,
    fields,
  };
}

export function setTicketId(ticketId) {
  return {
    type: SET_TICKET_ID,
    ticketId,
  };
}

export function update(state) {
  return {
    type: UPDATE,
    state,
  };
}
