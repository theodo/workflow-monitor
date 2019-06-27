'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tickets', 'trelloId', {
      type: Sequelize.STRING(),
    });
  },

  down: queryInterface => {
    return queryInterface
      .removeColumn('tickets', 'trelloId')
  },
};
