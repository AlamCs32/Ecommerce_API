const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const { Order } = require('./order')
const { Product } = require('./product')

class OrderDetail extends Model { }

OrderDetail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        primaryKey: true
    },
    OrderId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "Order",
            key: "id",
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "Product",
            key: "id",
        },
        allowNull: false
    },
    productPrice: {
        type: DataTypes.INTEGER,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "OrderDetail",
    tableName: "OrderDetails",
})

// OrderDetail.belongsTo(Order, {
//     foreignKey: "OrderId",
//     targetKey: "id"
// })
// OrderDetail.belongsTo(Product, {
//     foreignKey: "productId",
//     targetKey: "id"
// })

// OrderDetail.sync({ force: true }).then(_ => console.log("tables Created")).catch(err => console.log(err))
module.exports = { OrderDetail }