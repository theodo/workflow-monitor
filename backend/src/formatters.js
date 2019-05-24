const getTotatlTimeFromTasks = (tasks, key) =>
  tasks.reduce((total, task) => (task[key] ? total + task[key] : total), 0);

const formatFullTicket = (state, project, user, allocatedTime) => {
  const {
    currentTrelloCard: { idShort: thirdPartyId, name: description, ticketPoints: points },
    tasks,
  } = state;
  const { id: projectId } = project;
  const { id: userId } = user;

  const estimatedTime = getTotatlTimeFromTasks(tasks, 'estimatedTime');
  const realTime = getTotatlTimeFromTasks(tasks, 'realTime');

  return {
    thirdPartyId: thirdPartyId.toString(),
    description,
    status: 'DONE',
    userId,
    projectId,
    points,
    celerity: project.celerity,
    dailyDevelopmentTime: project.dailyDevelopmentTime,
    allocatedTime,
    estimatedTime,
    realTime,
  };
};

const formatTask = ticketId => ({
  label,
  estimatedTime,
  addedOnTheFly,
  realTime,
  problems,
  problemCategory,
}) => ({
  description: label,
  estimatedTime,
  addedOnTheFly: addedOnTheFly || false,
  problems:
    problems || problemCategory
      ? [
          {
            description: problems,
            problemCategory,
          },
        ]
      : [],
  realTime,
  ticketId,
});

const formatTasks = (state, ticket) => {
  const { tasks } = state;
  const { id: ticketId } = ticket;

  return tasks.map(formatTask(ticketId));
};

module.exports = { formatFullTicket, formatTasks, formatTask };
