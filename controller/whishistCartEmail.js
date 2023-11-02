const { Wishlist, Cart, User, Product } = require('../model')
const { sendMail } = require('../config/nodemailer')

class SendMaisToUser {

    static async WhishliastEmail(req, res) {
        let whish_list = await Wishlist.findAll({ where: { flag: false }, include: [User, Product] })
        for (let i of whish_list) {
            sendMail(i.User.email, "Razy Fasion", `You Added ${i.Product.title} in your Wishlist pls Order!`)
        }
        return res.status(200).send(whish_list)
    }

    static async CardEmail(req, res) {
        let cart = await Cart.findAll({ include: [User, Product] })
        for (let i of cart) {
            sendMail(i.User.email, "Razy Fasion", `You Added ${i.Product.title} in your card pls Order!`)
        }
        return res.status(200).send(cart)
    }

}

module.exports = SendMaisToUser