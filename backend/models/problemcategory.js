'use strict';
module.exports = (sequelize, DataTypes) => {
  const problemCategory = sequelize.define('problemCategory', {
    description: DataTypes.STRING
  }, {});
  problemCategory.associate = function(models) {
    // associations can be defined here
  };
  return problemCategory;
};
