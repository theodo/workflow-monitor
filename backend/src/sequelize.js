const Sequelize = require('sequelize');

const isDev = process.env.ENV && process.env.ENV === 'DEV';

const sequelize = new Sequelize('caspr', 'caspr', 'caspr', {
  host: isDev ? 'postgresql' : 'localhost',
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
  state: { type: Sequelize.TEXT },
});

const Project = sequelize.define('project', {
  id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  thirdPartyType: Sequelize.ENUM('NONE', 'TRELLO', 'JIRA'),
  thirdPartyId: { type: Sequelize.STRING, unique: true, allowNull: false },
});

const Ticket = sequelize.define('ticket', {
  id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
  thirdPartyId: { type: Sequelize.STRING, allowNull: true },
  complexity: { type: Sequelize.INTEGER, allowNull: true },
  status: { type: Sequelize.ENUM('PLANNING', 'DONE'), allowNull: false }
});

const Task = sequelize.define('task', {
  id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
  estimatedTime: { type: Sequelize.INTEGER, allowNull: true },
  realTime: { type: Sequelize.INTEGER, allowNull: true },
  problems: { type: Sequelize.STRING, allowNull: true },
});

User.hasOne(Project, { as: 'currentProject' })

Ticket.belongsTo(Project, {as: 'project'});
Ticket.belongsTo(User, {as: 'user'});

Ticket.hasMany(Task, {as: 'tasks'})

sequelize.sync();

module.exports = sequelize
