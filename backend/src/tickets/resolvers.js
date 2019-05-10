const { formatFullTicket, formatTasks } = require('../formatters');
const getAllocatedTimeFromPointsAndCelerity = require('../helpers');
const ticketDAO = require('./db');

module.exports = {
  Mutation: {
    saveTicket: async (_, { state }, { user }) => {
      const jsState = JSON.parse(state);

      const project = user.currentProject;

      const allocatedTime = getAllocatedTimeFromPointsAndCelerity(
        jsState.currentTrelloCard.ticketPoints,
        project.celerity,
        project.dailyDevelopmentTime,
      );

      const formattedTicket = formatFullTicket(jsState, project, user, allocatedTime);

      const ticket = await ticketDAO.upsert(formattedTicket, {
        thirdPartyId: formattedTicket.thirdPartyId,
      });

      const formattedTasks = formatTasks(jsState, ticket);
      await ticketDAO.refreshWithTasks(ticket.id, formattedTasks);

      return ticket.id;
    },
    setTicketThirdPartyId: async (_, { ticketId, idShort }) => {
      await ticketDAO.updateThirdPartyId(ticketId, idShort);
      return 1;
    },
  },
  Query: {
    tickets: (_, { pagination: { limit, offset } }, { user }) => {
      const project = user.currentProject;
      return ticketDAO.getTicketsByProject(project.id, limit, offset);
    },
    dailyPerformanceHistory: (_, { startDate, endDate }, { user }) => {
      const projectId = user.currentProject.id;
      return ticketDAO.getDailyPerformanceHistory(startDate, endDate, projectId);
    },
    ticket: (_, { ticketId }) => {
      return ticketDAO.getTicket(ticketId);
    },
  },
};
