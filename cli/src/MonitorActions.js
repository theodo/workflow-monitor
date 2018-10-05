const INIT_SESSION = 'INIT_SESSION';
const START_SESSION = 'START_SESSION';
const NEXT_TASK = 'NEXT_TASK';
const PREVIOUS_TASK = 'PREVIOUS_TASK';
const RESET_MONITOR = 'RESET_MONITOR';
const PLAY_OR_PAUSE_SESSION = 'PLAY_OR_PAUSE_SESSION';
const UPDATE = 'UPDATE';

function initSession() {
  return {
    type: INIT_SESSION,
  };
}

function startSession(tasks) {
  return {
    type: START_SESSION,
    tasks,
  };
}

function nextTask(newTasks, taskProblems, projectId) {
  return {
    type: NEXT_TASK,
    newTasks,
    taskProblems,
    projectId,
  };
}

function previousTask(newTasks, taskProblems) {
  return {
    type: PREVIOUS_TASK,
    newTasks,
    taskProblems,
  };
}

function playOrPauseSession() {
  return {
    type: PLAY_OR_PAUSE_SESSION,
  };
}

function resetMonitor(card) {
  return {
    type: RESET_MONITOR,
    card
  };
}

function update(state) {
  return {
    type: UPDATE,
    state,
  };
}

module.exports = {
  INIT_SESSION,
  START_SESSION,
  NEXT_TASK,
  PREVIOUS_TASK,
  RESET_MONITOR,
  PLAY_OR_PAUSE_SESSION,
  UPDATE,
  initSession,
  startSession,
  nextTask,
  previousTask,
  resetMonitor,
  playOrPauseSession,
  update,
};
