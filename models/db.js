const Sequelize = require('sequelize');

const sequelize = new Sequelize("list", "root", "123456", {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;