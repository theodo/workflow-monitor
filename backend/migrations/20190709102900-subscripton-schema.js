'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {

    return Promise.all([
      queryInterface.createSchema(
        'subscription'
      ),
      queryInterface.createTable(
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
        },
        {
          schema: 'subscription'
        }
      )
    ]);
  },down: function (queryInterface) {
    return Promise.all([
      queryInterface.dropTable(
        'subscription',
        {
          schema: 'subscription'
        }
      ),
      queryInterface.dropSchema(
        'subscription'
      )
    ]);
  }
};
