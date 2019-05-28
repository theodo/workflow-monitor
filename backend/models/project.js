'use strict';
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define(
    'project',
    {
      name: DataTypes.STRING,
      thirdPartyType: DataTypes.ENUM('NONE', 'TRELLO', 'JIRA'),
      thirdPartyId: { type: DataTypes.STRING, unique: true },
      celerity: { type: DataTypes.FLOAT, defaultValue: 6.0 },
      dailyDevelopmentTime: { type: DataTypes.INTEGER, defaultValue: 21600000 }, // 6 * 3600 * 1000
      performanceType: {
        type: DataTypes.ENUM('CASPR_TIME', 'CELERITY_TIME'),
        defaultValue: 'CASPR_TIME',
      },
    },
    {},
  );
  project.associate = function(models) {
    project.hasMany(models.problemCategory, { as: 'problemCategories' });
  };
  return project;
};
