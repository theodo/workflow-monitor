'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define('ticket', {
    description: DataTypes.STRING,
    thirdPartyId: DataTypes.STRING,
    complexity: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  ticket.associate = function(models) {
    ticket.belongsTo(models.project, {as: 'project'});
    ticket.belongsTo(models.user, {as: 'user'});
    ticket.hasMany(models.task, {as: 'tasks'})
  };
  return ticket;
};
