const Sequelize = require('sequelize');

const sequelize = new Sequelize('digitalprodsystem', 'digitalprodsystem', 'digitalprodsystem', {
  host: 'postgresql',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const User = sequelize.define('user', {
  id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
  fullName: { type: Sequelize.STRING, allowNull: false },
  trelloId: { type: Sequelize.STRING, unique: true, allowNull: false },
});

sequelize.sync({force: true});

module.exports = sequelize
