'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tickets', 'points', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('tickets', 'celerity', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('tickets', 'dailyDevelopmentTime', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('tickets', 'allocatedTime', {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('tickets', 'points'),
      queryInterface.removeColumn('tickets', 'celerity'),
      queryInterface.removeColumn('tickets', 'dailyDevelopmentTime'),
      queryInterface.removeColumn('tickets', 'allocatedTime'),
    ]);
  },
};
