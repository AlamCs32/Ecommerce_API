const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const moment = require('moment')
const { User } = require('../user/userModel')
const { Product } = require('./product')
class Wishlist extends Model { }

Wishlist.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Product",
            key: "id"
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id"
        }
    },
    date: {
        type: DataTypes.DATE
    },
    flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "Wishlist",
    tableName: "Wishlist",
    timestamps: false
})

Wishlist.belongsTo(User, {
    foreignKey: "userId",
    targetKey: 'id',
})

Wishlist.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id"
})
// Wishlist.sync({ force: true }).then(() => console.log("Tables is created ")).catch(error => console.log(error))


module.exports = { Wishlist }