const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    done: { 
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});


module.exports = User;