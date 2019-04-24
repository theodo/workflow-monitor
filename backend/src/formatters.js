const formatFullTicket = (state, project, user) => {
  const { currentTrelloCard: { id: thirdPartyId, name: description } } = state;
  const { id: projectId } = project;
  const { id: userId } = user;

  return {
    thirdPartyId,
    description,
    status: 'DONE',
    userId,
    projectId,
  }
};

const formatTask = (ticketId) => ({ label, estimatedTime, addedOnTheFly, realTime, problems, problemCategory }) => ({
  description: label,
  estimatedTime,
  addedOnTheFly: addedOnTheFly || false,
  problems: (problems || problemCategory) ?
    [{
      description: problems,
      problemCategory: problemCategory && { id: problemCategory.value, description: problemCategory.label }
    }]
    : [],
  realTime,
  ticketId,
});

const formatTasks = (state, ticket) => {
  const { tasks } = state;
  const { id: ticketId } = ticket;

  return tasks.map(formatTask(ticketId));
};

module.exports = { formatFullTicket, formatTasks ,formatTask }
