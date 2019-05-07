'use strict';

const SELECT_TOTAL_REAL_AND_ESTIMATED_TIME_FROM_TASKS = `
  SELECT "ticketId", SUM("estimatedTime") AS "totalEstimatedTime", SUM("realTime") AS "totalRealTime"
  FROM "tasks"
  GROUP BY "ticketId"
`;

const UPDATE_TICKETS_WITH_REAL_AND_ESTIMATED_TIME = `
  UPDATE "tickets"
  SET "realTime"=:ticketRealTime, "estimatedTime"=:ticketEstimatedTime
  WHERE "id"=:ticketId
`;

module.exports = {
  up: async queryInterface => {
    const rows = await queryInterface.sequelize.query(
      SELECT_TOTAL_REAL_AND_ESTIMATED_TIME_FROM_TASKS,
    );

    const tasksGroupedByTicket = rows[0];
    for (var i in tasksGroupedByTicket) {
      const ticketId = tasksGroupedByTicket[i].ticketId;
      const ticketRealTime = tasksGroupedByTicket[i].totalRealTime;
      const ticketEstimatedTime = tasksGroupedByTicket[i].totalEstimatedTime;
      queryInterface.sequelize.query(UPDATE_TICKETS_WITH_REAL_AND_ESTIMATED_TIME, {
        replacements: {
          ticketId: ticketId,
          ticketRealTime: ticketRealTime,
          ticketEstimatedTime: ticketEstimatedTime,
        },
      });
    }
    return rows;
  },

  down: queryInterface => {
    return queryInterface.sequelize.query(
      'UPDATE "tickets" SET "realTime"=null, "estimatedTime"=null',
    );
  },
};
