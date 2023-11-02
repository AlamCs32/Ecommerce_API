const { User, Product, Cart, updateJoi, addJoi, Wishlist, Category, Specification } = require('../model')
const { fieldsImages } = require('../config/multer')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Joi = require('joi');
const { sequelize, QueryTypes } = require('../config/dbConfig')
const { multipleSendMail } = require('../config/nodemailer');
const { CategorySearch } = require('../model/category/categoryStore');

class ProductControl {
    // ############################# Product #############################
    // Search Page and render 

    static async ViweProduct(req, res) {
        let search = { raw: true }
        search.where = { active: true }

        req.query.search ? search.where.title = {
            [Op.like]: `%${req.query.search}%`,
        } : "";

        req.query.category ? search.where.category = req.query.category : "";
        req.query.price ? search.where.price = { [Op.between]: req.query.price } : "";
        // Pagination
        search.limit = 10
        search.offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        let product = await Product.findAndCountAll(search)

        return res.status(200).render('search', { product: product.rows })
    }

    static async CategorySearch(req, res) {

        let search = { raw: true }
        search.where = { active: true }

        req.query.search ? search.where.title = {
            [Op.like]: `%${req.query.search}%`,
        } : "";
        // Pagination
        search.limit = 10
        search.offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        let product = await Product.findAll(search)

        let category = product.map(i => { return i.category })
        product = await Product.findAll({ where: { category }, limit: 10, offset: search.offset, attributes: { exclude: ['slug', 'userId', 'url', 'createdAt', 'updatedAt'] } })
        return res.status(200).send(product)

    }

    // Recent Added Product 
    static async Recent_product(req, res) {

        let page = req.query.page ? (req.query.page - 1) * 10 : 0;
        let product = await sequelize.query("SELECT * FROM `product` ORDER BY createdAt DESC limit 10 offset ? ", { replacements: [page], type: QueryTypes.SELECT }).catch(error => console.log(error.original))

        return res.send(product)
    }

    // Popular Product 
    static async popular_product(req, res) {

        let page = req.query.page ? (req.query.page - 1) * 10 : 0;
        let product = await sequelize.query("SELECT * FROM `wishlist` ORDER BY date DESC limit 10 offset ? ", { replacements: [page], type: QueryTypes.SELECT }).catch(error => console.log(error))

        let product_id = product.map(i => { return i.productId })
        product_id = [...new Set(product_id)].sort((a, b) => a - b)

        // OverWrite Variable With Other
        product = await Product.findAll({ where: { id: product_id } })

        return res.send(product)
    }

    static async trending_product(req, res) {
        let page = req.query.page ? (req.query.page - 1) * 10 : 0;

        let orderproduct = await sequelize.query("SELECT * FROM `orderproduct` ORDER BY createdAt DESC limit 50 offset ? ", { replacements: [page], type: QueryTypes.SELECT }).catch(error => console.log(error))

        let et = []

        orderproduct.map(i => {

            i.product_id.replace(/'/g, '')
            let data = JSON.parse(i.product_id)

            for (let j in data) {
                et.push(data[j])
            }
        })

        let productId = [...new Set(et)].sort((a, b) => a - b)

        let product = await Product.findAll({ where: { id: productId }, limit: 10, offset: page })

        return res.send(product)
    }

    // Seller OR Admin
    static async AddProduct(req, res) {

        let file = await fieldsImages(req, res).catch(err => {
            return res.status(400).json({ status: 'fail', message: "something went wronge in image upload" })
        })
        if (!file) {
            req.flash("fields", "image are required")
            return res.status(200).redirect('/product/admin/add')
        }
        let url = []
        file.product.map(i => {
            let path = "/upload/image/" + i.filename
            url.push(path)
        })
        let thumbnail
        file.thumbnail.map(i => thumbnail = i.filename)

        let valid = addJoi(req.body)
        if (valid) {
            console.log(valid)
            req.flash("fields", "all field are required")
            return res.status(200).redirect('/product/admin/add')
        }

        let category = await Category.findOne({ where: { name: req.body.category } })
        if (!category) {
            category = await Category.create({ name: req.body.category, flag: true }).catch(error => {
                return res.status(400).send({ error })
            })
        }

        req.body.userId = req.user.id
        req.body.url = url ? url : ""
        req.body.thumbnail = `/upload/image/${thumbnail}`
        req.body.price = req.body.MRP - req.body.Discount
        req.body.category = category.id

        let product = await Product.create(req.body).catch(error => {
            req.flash("AsynError", error)
            return res.status(200).redirect('/product/admin/add')
        })
        req.body.specification.productId = product.id
        let specification = await Specification.create({ Specification: req.body.specification }).catch(error => {
            req.flash("AsynError", error)
            return res.status(200).redirect('/product/admin/add')
        })

        // // Sending Response to client 
        req.flash("message", "Product is add successfully ")
        return res.status(200).redirect('/product/admin/view')
    }

    // Seller OR Admin
    static async UpdateProduct(req, res) {
        // image Adding is Pending 
        let file = await fieldsImages(req, res).catch(error => {
            return res.status(400).json({ status: 'fail', message: "something went wronge in image upload" })
        })

        if (!file) {
            req.flash("fields", "image are required")
            return res.status(200).redirect('/product/admin/add')
        }

        let url = []
        file.product.map(i => {
            let path = "/upload/image/" + i.filename
            url.push(path)
        })

        let thumbnail
        file.thumbnail.map(i => thumbnail = i.filename)

        //  redirect path is wronge 
        let valid = updateJoi(req.body)
        if (valid) {
            req.flash("fields", "all field are required")
            return res.status(200).redirect(`/product/admin/update/${req.params.id}`)
        }

        req.body.url = url ? url : "";
        req.body.thumbnail = `/upload/image/${thumbnail}`

        let UserProduct = await Product.findOne({ where: { id: req.params.id } })

        if (UserProduct.userId !== req.user.id) {
            req.flash('message', "Pls try again")
            return res.status(200).redirect('/product/admin/view')
        }
        // Updating Product 
        await Product.update(req.body, { where: { id: req.params.id } }).catch(error => {
            req.flash("AsynError", error)
            return res.status(200).redirect(`/product/admin/update/${req.params.id}`)
        })
        // Updating Category
        await CategorySearch.update({ categoryId: req.body.category }, { where: { productId: UserProduct.id } }).catch(error => {
            req.flash("AsynError", error)
            return res.status(200).redirect('/product/admin/add')
        })

        return res.status(200).redirect('/product/admin/view')
    }

    // Seller OR Admin
    static async DeleeteProduct(req, res) {
        //  redirect path is wronge 
        let UserProduct = await Product.findOne({ where: { id: req.params.id } })

        if (UserProduct.userId !== req.user.id) {
            req.flash('message', "Product is deleted")
            return res.status(200).redirect('/product/admin/view')
        }
        // /deleteing Product from data base
        await Product.update({ active: false }, { where: { id: req.params.id } }).catch(error => {
            req.flash("AsynError", error)
            return res.status(200).redirect(`/product/admin/update/${req.params.id}`)
        })

        req.flash('message', "Product is deleted")
        return res.status(200).redirect('/product/admin/view')
    }

    // ############################# Cart #############################
    // Cart Api get
    static async CartApi(req, res) {
        let schema = Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number()
        })
        let { error } = schema.validate(req.body)
        if (error) {
            return res.send({ error })
        }
        // Adding user id in req.body Object
        req.body.userId = req.user.id

        // finding data is present or not 
        let CartData = await Cart.findOne({ where: { productId: req.body.productId, userId: req.user.id } }).catch(error => {
            return res.status(404).send({ status: "fail", error: "internal server error" })
        })

        if (CartData) {
            // Updating product if it present 
            let result = await Cart.update(req.body, { where: { productId: req.body.productId, userId: req.user.id } }).catch(error => {
                return res.status(404).send({ status: "fail", error })
            })

            return res.send(result)
        }
        // adding product if it not  present 
        let cart = await Cart.create(req.body).catch(error => {
            return res.send({ error })
        })
        // Sending Api Response 
        return res.send({ cart })
    }
    // Cart Get Api
    static async getCart(req, res) {

        let cart = await Cart.findAll({
            raw: true, where: { userId: req.user.id }, include: [
                { model: Product, required: true, attributes: { exclude: ["updatedAt", "createdAt", "category", "stock", "userId", "slug"] } }
            ]
        }).catch(error => {
            return console.log({ error: error.original })
        })
        if (cart[0] == null) {
            return res.status(200).send("No Product in Cart")
        }
        return res.status(200).send(cart)
    }

    // Cart delet Api
    static async deleteCart(req, res) {

        let schema = Joi.object({
            cart_id: Joi.number().required()
        })
        let { error } = schema.validate(req.body)
        if (error) { return res.send(error.message) }

        let cart = await Cart.destroy({ where: { id: req.body.cart_id } }).catch(error => {
            return res.status(200).json({ error: error.original })
        })
        return res.status(200).send(cart)
    }

    // ############################# WishList #############################

    static async addWishlist(req, res) {
        let schema = Joi.object({
            productId: Joi.number().required()
        })
        let { error } = schema.validate(req.body)
        if (error) {
            return res.send({ error })
        }
        req.body.userId = req.user.id

        let wishlist = await Wishlist.create(req.body).catch(error => {
            return res.send({ error })
        })
        // Sending Api Response 
        return res.status(200).send({ wishlist })
    }
    // Cart Get Api
    static async getWishlist(req, res) {
        let wishlist = await Wishlist.findAll({
            where: { userId: req.user.id }, include: [
                { model: Product, required: true, attributes: { exclude: ["updatedAt", "createdAt", "category", "stock", "userId", "slug"] } }
            ]
        })

        return res.status(200).send(wishlist)
    }

    // Cart delet Api
    static async deleteWishlist(req, res) {
        let schema = Joi.object({
            id: Joi.number().required()
        })
        let { error } = schema.validate(req.body)
        if (error) { return res.status(400).send(error.message) }

        let wishlist = await Wishlist.destroy({ where: { id: req.body.id, userId: req.user.id } }).catch(error => {
            return res.status(200).json({ error })
        })

        return res.status(200).send({ status: wishlist })
    }

    // ############################ SLUG ############################

    static async Slug(req, res) {
        // Joi Validation 
        let schema = Joi.object({
            id: Joi.number(),
            url: Joi.string()
        })
        let { error } = schema.validate(req.query)
        if (error) { return res.status(200).json({ error }) }
        // Object Destructure
        req.query.id = req.query.id ? req.query.id : "";
        req.query.url = req.query.url ? req.query.url : "";
        // Search object
        let search = req.query.url || req.query.id ?
            {
                [Op.or]: [
                    { id: req.query.id },
                    { slug: req.query.url }
                ]
            }
            : {};
        // Finding Product 
        let product = await Product.findOne({
            where: search, attributes: {
                exclude: ['id', 'slug', 'userId', "category", "thumbnail", "url", "createdAt", "updatedAt"]
            }
        })
        // Sending Response
        return res.status(200).json({ product })
    }

}
module.exports = ProductControl