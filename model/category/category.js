const { sequelize, Model, DataTypes } = require('../../config/dbConfig')

class Category extends Model { }

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: "Category",
    tableName: "Category",
    timestamps: true
})
// Category.sync({ force: true }).then(() => console.log('Tables is created')).catch(error => console.log(error))

module.exports = { Category }