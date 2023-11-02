const { sequelize, DataTypes, QueryTypes, Model } = require('../../config/dbConfig')

class Specification extends Model { }

Specification.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Specification: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Specification",
    tableName: "Specification"
})

// Specification.sync({ force: true }).then(() => console.log("Specification Table is created!")).catch(error => console.error(error))
module.exports = { Specification }