'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    trelloId: DataTypes.STRING,
    fullName: DataTypes.STRING,
    state: DataTypes.TEXT
  }, {});
  user.associate = function(models) {
    user.belongsTo(models.project, { as: 'currentProject' })
  };
  return user;
};
