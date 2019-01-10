'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProblemCategory = sequelize.define('problemCategory', {
    description: DataTypes.STRING
  }, {});
  ProblemCategory.associate = function(models) {
    // associations can be defined here
  };
  return ProblemCategory;
};
