const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { User } = require('../user/userModel')
const { Product } = require('./product')

class Cart extends Model { }

Cart.init({
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
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: "Cart",
    tableName: "cart"
})

Cart.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
})
Cart.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
})
// Cart.sync({ force: true }).then(() => console.log("Tables is created ")).catch(error => console.log(error))

let valid = function (req) {
    let Schema = joi.object({
        quantity: joi.number()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { Cart, valid }