'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      estimatedTime: {
        type: Sequelize.INTEGER
      },
      realTime: {
        type: Sequelize.INTEGER
      },
      addedOnTheFly: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false
      },
      ticketId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tickets',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tasks');
  }
};
