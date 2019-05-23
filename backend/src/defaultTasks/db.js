const { sequelize } = require('../../models');
const { upsert } = require('../dbUtils');

class defaultTaskListDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.defaultTaskList;
  }

  getDefaultTaskList(defaultTaskListId) {
    return this.model.findById(defaultTaskListId, {
      include: {
        model: this.db.models.defaultTask,
        as: 'defaultTasks',
      },
    });
  }

  getDefaultTaskListsByProject(projectId) {
    return this.model.findAll({
      where: { projectId },
      include: {
        model: this.db.models.defaultTask,
        as: 'defaultTasks',
      },
    });
  }

  async refreshWithTasks(defaultTaskListId, defaultTasks) {
    await this.db.models.defaultTask.destroy({ where: { defaultTaskListId } });
    defaultTasks.map(async defaultTask => {
      await this.db.models.defaultTask.create(defaultTask);
    });
  }

  upsert(value, condition) {
    return upsert(this.model, value, condition);
  }
}

module.exports = new defaultTaskListDB(sequelize);
