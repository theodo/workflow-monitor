'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define(
    'ticket',
    {
      description: { type: DataTypes.STRING, allowNull: false },
      thirdPartyId: DataTypes.STRING,
      complexity: DataTypes.INTEGER,
      status: { type: DataTypes.ENUM('PLANNING', 'DONE'), allowNull: false },
      points: DataTypes.INTEGER,
      celerity: DataTypes.INTEGER,
      dailyDevelopmentTime: DataTypes.INTEGER,
      allocatedTime: DataTypes.INTEGER,
      estimatedTime: DataTypes.INTEGER,
      realTime: DataTypes.INTEGER,
    },
    {},
  );
  ticket.associate = function(models) {
    ticket.belongsTo(models.project, { as: 'project' });
    ticket.belongsTo(models.user, { as: 'user' });
    ticket.hasMany(models.task, { as: 'tasks' });
  };
  return ticket;
};
