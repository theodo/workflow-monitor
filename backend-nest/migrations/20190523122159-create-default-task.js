'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('defaultTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      check: {
        type: Sequelize.TEXT,
      },
      estimatedTime: {
        type: Sequelize.INTEGER,
      },
      defaultTasksListId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'defaultTasksLists',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('defaultTasks');
  },
};
