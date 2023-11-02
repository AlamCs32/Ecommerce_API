const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { OrderSir } = require('./orderModel')
const { Product } = require('../product/product')

class OrderProduct extends Model { }
OrderProduct.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER
    },
    product_id: {
        type: DataTypes.JSON
    },
    Quantity: {
        type: DataTypes.JSON
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
        type: DataTypes.STRING,
        defaultValue: true
    },
    remark: {
        type: DataTypes.STRING,
        defaultValue: "pending"
    }
}, {
    sequelize,
    modelName: "OrderProduct",
    tableName: "OrderProduct"
})

OrderProduct.belongsTo(OrderSir, {
    foreignKey: "order_id",
    targetKey: "id",
})

// let data = OrderProduct.findAll({ raw: true, include: OrderSir }).then(res => {
//     console.log(res)
// }).catch(error => {
//     console.log(error)
// })

// OrderProduct.sync({ force: true }).then(() => console.log("table is created")).catch(error => console.log(error))

module.exports = { OrderProduct }