'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tickets', 'estimatedTime', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('tickets', 'realTime', {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('tickets', 'estimatedTime'),
      queryInterface.removeColumn('tickets', 'realTime'),
    ]);
  },
};
