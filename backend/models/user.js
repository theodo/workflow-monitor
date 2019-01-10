'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    fullName: { type: DataTypes.STRING, allowNull: false },
    trelloId: { type: DataTypes.STRING, unique: true, allowNull: false },
    state: { type: DataTypes.TEXT },
  });
  User.associate = function(models) {
    User.belongsTo(models.project, { as: 'currentProject' });
  };
  return User;
};
