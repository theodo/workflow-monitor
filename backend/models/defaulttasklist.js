'use strict';
module.exports = (sequelize, DataTypes) => {
  const defaultTaskList = sequelize.define(
    'defaultTaskList',
    {
      type: DataTypes.ENUM('BEGIN', 'END'),
    },
    {},
  );
  defaultTaskList.associate = function(models) {
    defaultTaskList.belongsTo(models.project, { as: 'project' });
    defaultTaskList.hasMany(models.defaultTask, { as: 'defaultTasks' });
  };
  return defaultTaskList;
};
