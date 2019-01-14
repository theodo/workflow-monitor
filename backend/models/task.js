'use strict';
module.exports = (sequelize, DataTypes) => {
  const task = sequelize.define('task', {
    description: { type: DataTypes.STRING, allowNull: false },
    estimatedTime: DataTypes.INTEGER,
    realTime: DataTypes.INTEGER,
    addedOnTheFly: DataTypes.BOOLEAN,
  }, {});
  task.associate = function(models) {
    task.hasMany(models.problem, {as: 'problems', onDelete: 'cascade', hooks: true})
  };
  return task;
};
