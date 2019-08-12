'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(
        'UPDATE projects set `dailyDevelopmentTime` = `dailyDevelopmentTime` * 1000;',
      ),
      queryInterface.changeColumn('projects', 'dailyDevelopmentTime', {
        type: Sequelize.INTEGER,
        defaultValue: 21600000,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query(
        'UPDATE projects set `dailyDevelopmentTime` = `dailyDevelopmentTime` / 1000;',
      ),
      queryInterface.changeColumn('projects', 'dailyDevelopmentTime', {
        type: Sequelize.INTEGER,
        defaultValue: 21600,
      }),
    ]);
  },
};
