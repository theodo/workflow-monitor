'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    description: { type: DataTypes.STRING, allowNull: false },
    estimatedTime: { type: DataTypes.INTEGER, allowNull: true },
    realTime: { type: DataTypes.INTEGER, allowNull: true },
    problems: { type: DataTypes.STRING, allowNull: true },
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.problemCategory, {as:'problemCategory'})
  };
  return Task;
};
