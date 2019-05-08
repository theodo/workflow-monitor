const { SELECT_DAILY_PERFORMANCE_HISTORY_QUERY } = require('../dbUtils');
const { sequelize } = require('../../models');

class DB {
  constructor({ db }) {
    this.db = db;
  }

  getORM() {
    return this.db;
  }

  initialize(config) {
    this.context = config.context;
  }

  getDailyPerformanceHistory(startDate, endDate, projectId) {
    return this.db.query(SELECT_DAILY_PERFORMANCE_HISTORY_QUERY, {
      replacements: { projectId, startDate, endDate },
      type: this.db.QueryTypes.SELECT,
    });
  }

  findUser(userTrelloId) {
    return this.db.models.user.find({
      where: { trelloId: userTrelloId },
      include: [{ model: this.db.models.project, as: 'currentProject' }],
    });
  }
}

module.exports = new DB({ db: sequelize });
