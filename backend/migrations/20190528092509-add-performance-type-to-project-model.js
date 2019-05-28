'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projects', 'performanceType', {
        type: Sequelize.ENUM('CASPR_TIME', 'CELERITY_TIME'),
        defaultValue: 'CELERITY_TIME',
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface
        .removeColumn('projects', 'performanceType')
        .then(() => queryInterface.sequelize.query('DROP TYPE "enum_projects_performanceType";')),
    ]);
  },
};
