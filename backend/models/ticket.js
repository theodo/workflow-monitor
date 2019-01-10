'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('ticket', {
    description: { type: DataTypes.STRING, allowNull: false },
    thirdPartyId: { type: DataTypes.STRING, allowNull: true },
    complexity: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('PLANNING', 'DONE'), allowNull: false }
  });
  Ticket.associate = function(models) {
    Ticket.belongsTo(models.project, {as: 'project'});
    Ticket.belongsTo(models.user, {as: 'user'});
    Ticket.hasMany(models.task, {as: 'tasks'});
  };
  return Ticket;
};
