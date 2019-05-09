/* Temporary class file for the backend refactoring: The idea is to move all sequelize and DB code into their own files */
const { sequelize } = require('../../models');

class DB {
  constructor({ db }) {
    this.db = db;
  }

  getORM() {
    return this.db;
  }

  findUser(userTrelloId) {
    return this.db.models.user.find({
      where: { trelloId: userTrelloId },
      include: [{ model: this.db.models.project, as: 'currentProject' }],
    });
  }
}

module.exports = new DB({ db: sequelize });
