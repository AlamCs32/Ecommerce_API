const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { User } = require('../user/userModel')
class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "User",
            key: "id",
        }
    },
    ammount: {
        type: DataTypes.INTEGER
    },
    shipping_address: {
        type: DataTypes.STRING
    },
    shipping_contact: {
        type: DataTypes.STRING
    },
    shipping_status: {
        type: DataTypes.STRING,
        defaultValue: "Delevering"
    },
}, {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    createdAt: "Order_Date"
})

// Order.belongsTo(User, {
//     foreignKey: "userId",
//     targetKey: 'id'
// })

// Order.sync({ force: true }).then(_ => console.log("tables Created")).catch(err => console.log(err))

let addJoiOrder = (req) => {
    let OrderSchema = joi.object({
        ammount: joi.number().min(1).required(),
        shipping_contact: joi.number().min(1).required(),
        shipping_address: joi.string().min(1).required(),
        productPrice: joi.number().required(),
        quantity: joi.number().required()
    })
    let { error } = OrderSchema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { Order, addJoiOrder }