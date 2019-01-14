'use strict';
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define('project', {
    name: DataTypes.STRING,
    thirdPartyType: DataTypes.ENUM('NONE', 'TRELLO', 'JIRA'),
    thirdPartyId: { type: DataTypes.STRING, unique: true }
  }, {});
  project.associate = function(models) {
    // associations can be defined here
  };
  return project;
};
