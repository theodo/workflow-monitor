'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects', 'performanceType', {
      type: Sequelize.ENUM('CASPR_TIME', 'CELERITY_TIME'),
      defaultValue: 'CASPR_TIME',
    });
  },

  down: queryInterface => {
    return queryInterface
      .removeColumn('projects', 'performanceType')
      .then(() => queryInterface.sequelize.query('DROP TYPE "enum_projects_performanceType"'));
  },
};
