const { sequelize } = require('../../models');
const { upsert } = require('../dbUtils');

const SELECT_DAILY_PERFORMANCE_HISTORY_QUERY = `
  SELECT date("createdAt") as "creationDay",
  SUM(CASE WHEN "allocatedTime" < "realTime" THEN 1 ELSE 0 END) AS "celerityFailedTicketsCount",
  SUM(CASE WHEN "estimatedTime" < "realTime" THEN 1 ELSE 0 END) AS "casprFailedTicketsCount"
  FROM "tickets"
  WHERE
    "projectId"=:projectId
    AND "createdAt" BETWEEN :startDate AND :endDate
  GROUP BY date("createdAt")
  ORDER BY date("createdAt");
`;

class ticketDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.ticket;
  }

  getORM() {
    return this.db;
  }

  getDailyPerformanceHistory(startDate, endDate, projectId) {
    return this.db.query(SELECT_DAILY_PERFORMANCE_HISTORY_QUERY, {
      replacements: { projectId, startDate, endDate },
      type: this.db.QueryTypes.SELECT,
    });
  }

  getTicket(ticketId) {
    return this.model.findById(ticketId, {
      include: {
        model: this.db.models.task,
        as: 'tasks',
        include: {
          model: this.db.models.problem,
          as: 'problems',
          include: {
            model: this.db.models.problemCategory,
            as: 'problemCategory',
          },
        },
      },
    });
  }

  getTicketsByProject(projectId, limit, offset) {
    return this.model.findAndCountAll({
      where: { projectId },
      limit,
      order: [['createdAt', 'DESC']],
      offset,
    });
  }

  async refreshWithTasks(ticketId, formattedTasks) {
    await this.db.models.task.destroy({ where: { ticketId } });
    formattedTasks.map(async formattedTask => {
      const task = await this.db.models.task.create(formattedTask);

      formattedTask.problems.map(async formattedProblem => {
        formattedProblem.taskId = task.id;
        const problem = await this.db.models.problem.create(formattedProblem);
        formattedProblem.problemCategory &&
          problem.setProblemCategory(formattedProblem.problemCategory.id);
        await problem.save();
      });
    });
  }

  updateThirdPartyId(ticketId, thirdPartyId) {
    return this.model.update({ thirdPartyId: thirdPartyId }, { where: { id: ticketId } });
  }

  upsert(value, condition) {
    return upsert(this.model, value, condition);
  }
}

module.exports = new ticketDB(sequelize);
