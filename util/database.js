const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root','funix',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize