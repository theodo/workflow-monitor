const { sequelize } = require('../../models');
const { upsert } = require('../dbUtils');

class defaultTasksListDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.defaultTasksList;
  }

  getDefaultTasksList(defaultTasksListId) {
    return this.model.findById(defaultTasksListId, {
      include: {
        model: this.db.models.defaultTask,
        as: 'defaultTasks',
      },
    });
  }

  getDefaultTasksListsByProject(projectId) {
    return this.model.findAll({
      where: { projectId },
      include: {
        model: this.db.models.defaultTask,
        as: 'defaultTasks',
      },
      order: [[{ model: this.db.models.defaultTask, as: 'defaultTasks' }, 'id', 'ASC']],
    });
  }

  async refreshWithTasks(defaultTasksListId, defaultTasks) {
    await this.db.models.defaultTask.destroy({ where: { defaultTasksListId } });
    defaultTasks.map(async defaultTask => {
      await this.db.models.defaultTask.create(defaultTask);
    });
  }

  upsert(value, condition) {
    return upsert(this.model, value, condition);
  }
}

module.exports = new defaultTasksListDB(sequelize);
