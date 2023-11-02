const { User, Order, OrderDetail, Product, Cart, updateJoi, addJoi, valid, addJoiOrder } = require('../model')
const { sequelize } = require('../config/dbConfig')


class OrderApi {
    //  Depricated Function 
    static async ViewOrder(req, res) {

        let order = await Order.findAll({ where: { userId: req.user.id } }).catch(err => { return res.send("internal server error") })

        return res.send({ order })
    }

    static async AddOrder(req, res) {

        let valid = addJoiOrder(req.body)
        if (valid) { return console.log(valid) }

        let { ammount, shipping_contact, shipping_address, quantity } = req.body

        let t = await sequelize.transaction()

        let product = await Product.findOne({ where: { id: req.params.id } }).catch(err => { console.log({ err }) })

        if (quantity > product.stock) {
            req.flash("message", `Product quantity availabel is ${product.stock}`)
            return res.status(200).redirect('/product/order')
        }

        let order = await Order.create({
            userId: req.user.id,
            ammount,
            shipping_address,
            shipping_contact,
        }, { transaction: t }).catch(async (err) => {
            await t.rollback()
            return console.log({ Error: err })
        })

        let orderDetails = await OrderDetail.create({
            OrderId: order.id,
            productId: product.id,
            productPrice: product.price,
            quantity
        }, { transaction: t }).catch(async (err) => {
            await t.rollback()
            return console.log({ Error: err })
        })

        await t.commit()

        product.stock -= quantity
        await product.save()

        return res.send({ order, orderDetails })
    }

    static async CancleOrder(req, res) {

        let product = await Product.findOne({ where: { id: req.params.pid } }).catch(err => {
            return console.log({ err })
        })

        let order = await Order.findOne({ where: { id: req.params.rid } }).catch(err => {
            return console.log({ err })
        })

        if (order.userId !== req.user.id) {
            req.flash("message", `Product quantity availabel is ${product.stock}`)
            return res.status(200).redirect('/product/order')
        }

        let orderDetails = await OrderDetail.findOne({ where: { OrderId: order.id } }).catch(err => {
            return console.log({ err })
        })
        await Order.update({ shipping_status: "Cancle" }, { where: { id: req.params.rid }, logging: false }).catch(err => { return next(err) })

        // Updating Status 
        await Order.update({ shipping_status: "Cancle" }, { where: { id: req.params.rid }, logging: false }).catch(err => { return next(err) })

        //  updating Product Stock 
        product.stock += orderDetails.quantity
        await product.save()

        return res.send({ order, orderDetails })
    }

}
module.exports = OrderApi