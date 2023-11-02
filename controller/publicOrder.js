const { OrderSir, OrderProduct } = require('../model')
class OrderPage {

    static async ViewOrderPage(req, res) {

        let order = await OrderSir.findAll({ where: { userId: req.user.id } }).catch(error => {
            return console.log({ error })
        })
        let id = order.map(i => {
            return i.id
        })
        
        let orderDetails = await OrderProduct.findAll({ where: { Order_id: id } })
        
        let data = {
            title: "Home Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }

        return res.status(200).render("order", { order, orderDetails, data })
    }

}

module.exports = OrderPage