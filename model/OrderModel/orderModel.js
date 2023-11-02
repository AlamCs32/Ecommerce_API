const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { User } = require('../user/userModel')

class OrderSir extends Model { }
OrderSir.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER
    },
    total_product: {
        type: DataTypes.INTEGER
    },
    Quantity: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.INTEGER
    },
    discounted_amount: {
        type: DataTypes.INTEGER
    },
    tottal_ammount: {
        type: DataTypes.INTEGER
    },
    shipping_details: {
        type: DataTypes.STRING
    },
    order_status: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    payment_status: {
        type: DataTypes.STRING,
        defaultValue: "COD"
    },
    delivery_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending"
    },
    delivery_location: {
        type: DataTypes.STRING
    },
    remark: {
        type: DataTypes.STRING,
        defaultValue: "pending"
    },
    updatedBy: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: "OrderSir",
    tableName: "OrderSir"
})

OrderSir.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
})
// OrderSir.sync({ force: true }).then(error => {
//     console.log({ error })
// }).catch(error => {
//     console.log({ error })
// })
// OrderSir.sync({ force: true }).then(() => console.log("table is created")).catch(error => console.log(error))
// OrderSir.update({order_status:"Active"},{where:{id:6}}).then(res=>{
//     console.log(res)
// })
let validorder = (req) => {

    let Schema = joi.object({
        productKey: joi.array(),
        price: joi.number(),
        discounted_amount: joi.number(),
        shipping_details: joi.string(),
        remark: joi.string()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { OrderSir, validorder }