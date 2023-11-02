const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize')


const sequelize = new Sequelize("mysql://root@localhost/razy", { logging: false })

sequelize.authenticate().then(() => console.log("DataBase Connected")).catch(error => console.log(error.original))

module.exports = { sequelize, Model, DataTypes, QueryTypes }