'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projects', 'celerity', {
        type: Sequelize.INTEGER,
        defaultValue: 6,
      }),
      queryInterface.addColumn('projects', 'dailyDevelopmentTime', {
        type: Sequelize.INTEGER,
        defaultValue: 21600,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('projects', 'celerity'),
      queryInterface.removeColumn('projects', 'dailyDevelopmentTime'),
    ]);
  },
};
