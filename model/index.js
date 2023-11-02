const { User, UserValidate } = require('./user/userModel')
const { Product, updateJoi, addJoi } = require('./product/product')
const { Cart, valid } = require('./product/cart')
const { Order, addJoiOrder } = require('./product/order')
const { OrderDetail } = require('./product/orderDetails')
const { Wishlist } = require('./product/wishlist')
const { Category } = require('./category/category')
const { Address, addressValidate, addressCreateValidate } = require('./user/userAddress')
const { OrderSir, validorder } = require('./OrderModel/orderModel')
const { OrderProduct } = require('./OrderModel/orderProduct')
const { Order_payment, validate } = require('./OrderModel/order_payment')
const { Specification } = require('./product/specification')
module.exports = {
    Order,
    OrderDetail, Product,
    User, Cart, Wishlist, Category, UserValidate,
    updateJoi, addJoi,
    valid, addJoiOrder,
    Address, addressValidate, addressCreateValidate,
    OrderSir, validorder,
    OrderProduct,
    Order_payment, validate,
    Specification
}