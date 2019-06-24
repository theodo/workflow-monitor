const ERROR_IDS = {
  PREVIOUS_WHEN_FIRST_TASK: 'PREVIOUS_WHEN_FIRST_TASK',
  NEXT_WHEN_RESULTS: 'NEXT_WHEN_RESULTS',
  UNCHECKED_TASK: 'UNCHECKED_TASK'
}

const ERROR_MESSAGES = {
  PREVIOUS_WHEN_FIRST_TASK: 'To access your planning, please go to Caspr website',
  NEXT_WHEN_RESULTS: 'You already finished your ticket',
  UNCHECKED_TASK: 'If yes, please go to Caspr website to confirm. Click this card to be redirected'
}

module.exports = { ERROR_IDS, ERROR_MESSAGES }
