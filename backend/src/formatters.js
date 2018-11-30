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

const formatTasks = (state, ticket) => {
  const { tasks } = state;
  const { id: ticketId } = ticket;

  return tasks.map(({ label, estimatedTime, realTime, problems }) => ({
    description: label,
    estimatedTime,
    realTime,
    problems,
    ticketId,
  }));
};

module.exports = { formatFullTicket, formatTasks }
