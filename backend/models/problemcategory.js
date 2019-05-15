'use strict';
module.exports = (sequelize, DataTypes) => {
  const problemCategory = sequelize.define(
    'problemCategory',
    {
      description: DataTypes.STRING,
    },
    {},
  );
  problemCategory.associate = function(models) {
    problemCategory.belongsTo(models.project, { as: 'project' });
  };
  return problemCategory;
};
