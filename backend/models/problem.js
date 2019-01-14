'use strict';
module.exports = (sequelize, DataTypes) => {
  const problem = sequelize.define('problem', {
    description: DataTypes.STRING
  }, {});
  problem.associate = function(models) {
    problem.belongsTo(models.problemCategory, { as: 'problemCategory' });
    problem.belongsTo(models.task ,{ onDelete: 'cascade' });
  };
  return problem;
};
