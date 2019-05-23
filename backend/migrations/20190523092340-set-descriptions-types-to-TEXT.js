'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('tasks', 'description', {
        type: Sequelize.TEXT(),
        allowNull: false,
      }),
      queryInterface.changeColumn('tickets', 'description', {
        type: Sequelize.TEXT(),
        allowNull: false,
      }),
      queryInterface.changeColumn('problems', 'description', {
        type: Sequelize.TEXT(),
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('tasks', 'description', {
        type: Sequelize.STRING(),
        allowNull: false,
      }),
      queryInterface.changeColumn('tickets', 'description', {
        type: Sequelize.STRING(),
        allowNull: false,
      }),
      queryInterface.changeColumn('problems', 'description', {
        type: Sequelize.STRING(),
      }),
    ]);
  },
};
