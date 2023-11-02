const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { OrderSir } = require('./orderModel')

class Order_payment extends Model { }
Order_payment.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER
    },
    amount: {
        type: DataTypes.INTEGER
    },
    method: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    payment_details: {
        type: DataTypes.JSON,
    }
}, {
    sequelize,
    modelName: "Order_payment",
    tableName: "Order_payment"
})

// Order_payment.belongsTo(OrderSir, {
//     foreignKey: "order_id",
//     targetKey: "id"
// })

// Order_payment.sync({ force: true }).then(() => console.log("stable is created")).catch(error => console.log(error))
let validate = (req) => {
    let Schema = joi.object({
        order_id: joi.number().required(),
        amount: joi.number().required(),
        method: joi.string().required(),
        status: joi.string().required(),
        payment_details: joi.object().required(),
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { Order_payment, validate }