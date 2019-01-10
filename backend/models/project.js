'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    name: { type: DataTypes.STRING, allowNull: false },
    thirdPartyType: { type: DataTypes.ENUM('NONE', 'TRELLO', 'JIRA') },
    thirdPartyId: { type: DataTypes.STRING, unique: true, allowNull: false },
  });
  Project.associate = function(models) {
    // associations can be defined here
  };
  return Project;
};
