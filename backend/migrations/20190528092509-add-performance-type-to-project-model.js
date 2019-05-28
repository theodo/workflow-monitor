'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projects', 'performanceType', {
        type: Sequelize.ENUM('CASPR_TIME', 'CELERITY_TYPE'),
        defaultValue: 'CELERITY_TYPE',
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([queryInterface.removeColumn('projects', 'performanceType')]);
  },
};
