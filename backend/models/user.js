'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    trelloId: { type: DataTypes.STRING, unique: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    state: DataTypes.TEXT
  }, {});
  user.associate = function(models) {
    user.belongsTo(models.project, { as: 'currentProject' })
  };
  return user;
};
