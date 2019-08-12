'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
        'subscription',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
          },
          operationId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          connectionId: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          connectionEndpoint: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          operation: {
            allowNull: false,
            type: Sequelize.TEXT(),
          },
          triggerName: {
            allowNull: false,
            type: Sequelize.STRING,
          }
        }
      );
  },down: function (queryInterface) {
    return queryInterface.dropTable('subscription');
  }
};
