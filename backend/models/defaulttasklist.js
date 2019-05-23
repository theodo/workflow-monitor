'use strict';
module.exports = (sequelize, DataTypes) => {
  const defaultTasksList = sequelize.define(
    'defaultTasksList',
    {
      type: DataTypes.ENUM('BEGINNING', 'END'),
    },
    {},
  );
  defaultTasksList.associate = function(models) {
    defaultTasksList.belongsTo(models.project, { as: 'project' });
    defaultTasksList.hasMany(models.defaultTask, { as: 'defaultTasks' });
  };
  return defaultTasksList;
};
