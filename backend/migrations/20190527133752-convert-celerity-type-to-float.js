'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('projects', 'celerity', {
        type: Sequelize.FLOAT(),
        defaultValue: 6.0,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('projects', 'celerity', {
        type: Sequelize.INTEGER(),
        defaultValue: 6,
      }),
    ]);
  },
};
