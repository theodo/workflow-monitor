/* Temporary class file for the backend refactoring: The idea is to move all sequelize and DB code into their own files */
const { sequelize } = require('../../models');

class DB {
  constructor({ db }) {
    this.db = db;
  }

  getORM() {
    return this.db;
  }
}

module.exports = new DB({ db: sequelize });
