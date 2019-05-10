const { sequelize } = require('../../models');

class userDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.user;
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

module.exports = new userDB(sequelize);
