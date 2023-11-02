const Joi = require('joi');
const { sequelize, QueryTypes } = require('../config/dbConfig');
const { Product, Cart, Order, Specification } = require('../model')

class PublicProduct {

    static async HomePage(req, res) {
        let page = req.query.page ? (req.query.page - 1) * 10 : 0;

        let product = await Product.findAll({
            attributes: {
                exclude: ['userId', 'category', 'createdAt', 'updatedAt']
            }, limit: 10, offset: page
        }).catch(error => {
            console.log({ error })
        })
        let a = product.map(i => {
            i.url = i.url.replace(/'/g, '')
            i.url = JSON.parse(i.url)
            return i.url
        })

        let data = {
            title: "Home Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("index", { product, data })
    }
    static async product_Page(req, res) {
        let schema = Joi.object({
            id: Joi.number()
        })
        let { error } = schema.validate(req.params)
        if (error) {
            return res.status(400).send("<b>Invalid 404</b>")
        }

        let specification = await sequelize.query("SELECT * FROM `specification`,product WHERE JSON_UNQUOTE(JSON_EXTRACT(Specification,'$.productId')) = ? and product.id = JSON_UNQUOTE(JSON_EXTRACT(Specification,'$.productId'))", { replacements: [req.params.id], type: QueryTypes.SELECT })

        if (specification[0] == null) {
            return res.status(400).send({ status: "fail", message: "No Product Found" })
        }

        specification.map(i => {
            i.url = i.url.replace(/'/g, '')
            i.url = JSON.parse(i.url)

            i.Specification = i.Specification.replace(/'/g, '')
            i.Specification = JSON.parse(i.Specification)

        })

        return res.status(200).render('ProductView', { product: specification[0] })
    }
    static async AddProductPage(req, res) {
        let data = {
            title: "Add Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("addProduct", { data })
    }
    //  View Page for Admin
    static async ViewProductPage(req, res) {
        let product = await Product.findAll({ where: { userId: req.user.id } })
        let data = {
            title: "view Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("adminView", { product, data })
    }
    // Update Product 
    static async UpdateProductPage(req, res) {
        let data = {
            title: "update Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("adminUpdate", { data })
    }
    // Cart Page 
    static async CartPage(req, res) {
        let cart = await Cart.findAll({ where: { userId: req.user.id } })
        let id = []
        cart.map(i => {
            id.push(i.productId)
        })
        let product = await Product.findAll({ where: { id } })

        let data = {
            title: "update Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }

        return res.status(200).render("cart", { product, data })
    }
    //Order Page 
    static async OrderPage(req, res) {
        let order = await Order.findAll({ where: { userId: req.user.id } })

        let data = {
            title: "update Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }

        return res.status(200).render("order", { order, data })
    }
}

module.exports = PublicProduct