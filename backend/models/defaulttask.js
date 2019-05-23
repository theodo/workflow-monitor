'use strict';
module.exports = (sequelize, DataTypes) => {
  const defaultTask = sequelize.define(
    'defaultTask',
    {
      description: DataTypes.TEXT,
      estimatedTime: DataTypes.INTEGER,
    },
    {},
  );
  defaultTask.associate = function(models) {
    defaultTask.belongsTo(models.defaultTaskList, { as: 'defaultTaskList' });
  };
  return defaultTask;
};
