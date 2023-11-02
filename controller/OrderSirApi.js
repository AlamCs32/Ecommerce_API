const Joi = require("joi");
const { OrderSir, validorder, Product, OrderProduct, validate, Order_payment, Order } = require("../model");
const { sequelize } = require('../config/dbConfig')

class OrderProducts {
    // Add Order
    static async PlaceOrder(req, res) {
        let valid = validorder(req.body)
        if (valid) { return res.send(valid) }

        let productId = req.body.productKey.map(i => { return i.productId })

        let Quantity = 0;
        for (let i of req.body.productKey) {
            Quantity += i.Quantity
        }
        let product = await Product.findAll({ where: { id: productId } }).catch(error => {
            return res.status(400).send(error)
        })

        for (let i in product) {
            if (product[i].stock < req.body.productKey[i].Quantity) {
                return res.status(400).send('Out of Stock')
            }
        }
        // Adding Product Ammount info a Variable 
        let productPrice = 0
        for (let i in product) {
            productPrice += product[i].price * req.body.productKey[i].Quantity
        }
        // return res.send({ productPrice })
        if (productPrice !== req.body.price) {
            return res.status(400).send({ status: "fail", message: "Pls add Valid price" })
        }
        0
        // Adding Addisional fields in req.body Object 
        req.body.userId = req.user.id
        req.body.tottal_ammount = req.body.price - req.body.discounted_amount
        req.body.Quantity = Quantity

        // Updating Product Status 
        for (let i in product) {
            let stock = product[i].stock - req.body.productKey[i].Quantity
            await Product.update({ stock }, { where: { id: product[i].id } }).catch(error => {
                return res.status(404).send(error)
            })
        }
        // Object Destructuring 
        req.body.total_product = req.body.productKey.length

        let order = await OrderSir.create(req.body).catch(error => {
            return res.status(400).send(error)
        })
        // Adding Data in OrderProduct
        Quantity = req.body.productKey.map(i => { return i.Quantity })
        let orderProduct = await OrderProduct.create({
            order_id: order.id,
            product_id: productId,
            Quantity: Quantity,
            price: req.body.price,
            discounted_amount: req.body.discounted_amount,
            tottal_ammount: req.body.tottal_ammount,
            shipping_details: req.body.shipping_details,
            remark: req.body.remark
        }).catch(error => {
            return res.status(400).send(error)
        })

        return res.status(200).send({ order, orderProduct })
    }

    // ####################### Get Order User #######################
    static async ViewPlaceOrder(req, res) {
        let order = await OrderSir.findAll({
            where: { userId: req.user.id }, attributes: {
                exclude: ["userId", "productKey", "Quantity", "createdAt", "updatedAt"]
            }
        })
        return res.status(200).send(order)
    }

    // ####################### Cancle Order User #######################
    static async CanclePlaceOrder(req, res) {
        // Validating Req.body 
        let Schema = Joi.object({
            oId: Joi.number().required()
        })
        let { error } = Schema.validate(req.body, { abortEarly: true })
        if (error) { return res.send(error.message) }

        // Finding Order 
        let order = await OrderSir.findOne({ where: { id: req.body.oId } }).catch(error => {
            return res.status(400).send(error)
        })
        if (order.userId !== req.user.id) {
            return res.status(400).send({ status: "fail", message: "No Product Found" })
        }
        if (!order || order.order_status === 2 || order.order_status === 3) {
            return res.status(400).send("No Order Found Or Order Is Cancle ")
        }
        let orderProduct = await OrderProduct.findOne({ where: { order_id: order.id } }).catch(error => {
            return res.status(400).send(error)
        })
        // Converting And Replacing String into Array format
        let a = orderProduct.product_id;
        let b = orderProduct.Quantity;
        // Replacing ' from data
        a = a.replace(/'/g, '');
        b = b.replace(/'/g, '');
        // Parsing to make it array
        orderProduct.product_id = JSON.parse(a);
        orderProduct.Quantity = JSON.parse(b);

        // Finding Product 
        let product = await Product.findAll({ where: { id: orderProduct.product_id } }).catch(error => {
            return res.status(400).send(error)
        })
        // Updating Product Stock 
        for (let i in product) {
            let stock = product[i].stock + orderProduct.Quantity[i]
            await Product.update({ stock }, { where: { id: product[i].id } }).catch(error => {
                return res.status(404).send(error)
            })
        }
        // Updating Order Status
        let result = await OrderSir.update({ order_status: 2, payment_status: "Cancle", delivery_status: "Cancle", updatedBy: req.user.id }, { where: { id: order.id } }).catch(error => {
            return res.status(404).send(error)
        })
        // resnding Response TO User
        return res.send({ result, message: "Order Cancled" })
    }

    // ####################### Cancle/View Order ADMIN #######################

    // Admin Order Cancle Function 
    static async CancleOrderAdmin(req, res) {

        let schema = Joi.object({
            order_id: Joi.number().required(),
            order_status: Joi.number().required()
        })

        let { error } = schema.validate(req.body, { abortEarly: false })
        if (error) { return res.status(400).send(error.message) }

        let orderProduct = await OrderProduct.findOne({ where: { order_id: req.body.order_id }, include: OrderSir })

        if (orderProduct.OrderSir.order_status == 2 || orderProduct.OrderSir.order_status == 3) {
            return res.status(400).send("Order is Cancle")
        }

        // Replacing ' from data
        orderProduct.product_id = orderProduct.product_id.replace(/'/g, '');
        orderProduct.Quantity = orderProduct.Quantity.replace(/'/g, '');
        // Parsing to make it array
        orderProduct.product_id = JSON.parse(orderProduct.product_id);
        orderProduct.Quantity = JSON.parse(orderProduct.Quantity);

        // Finding Product 
        let product = await Product.findAll({ where: { id: orderProduct.product_id } }).catch(error => {
            return res.status(400).send(error)
        })

        // Updating Product Stock 
        for (let i in product) {
            let stock = product[i].stock + orderProduct.Quantity[i]
            await Product.update({ stock }, { where: { id: product[i].id } }).catch(error => {
                return res.status(404).send(error)
            })
        }
        // Updating Order Status
        let result = await OrderSir.update({ order_status: req.body.order_status, payment_status: "Cancle", delivery_status: "Cancle", updatedBy: req.user.id }, { where: { id: orderProduct.OrderSir.id } }).catch(error => {
            return res.status(404).send(error)
        })
        // resnding Response TO User
        return res.send({ result, message: "Order Cancled" })

    }
    // ############################ Payment Controller ############################

    // static async paymentPay(req, res) {
    //     let valid = validate(req.body)
    //     if (valid) { return res.status(400).send(valid) }

    //     let { order_id, amount, method } = req.body

    //     let t = await sequelize.transaction()

    //     let order = await OrderProduct.findOne({
    //         where: { order_id }
    //     }).catch(error => {
    //         return res.status(400).send({ error })
    //     })
    //     if (!order) {
    //         return res.status(400).send("No Order Found")
    //     }
    //     let orderpayment = await Order_payment.findOne({ where: { order_id } }).catch(error => {
    //         return res.status(400).send({ error })
    //     })
    //     if (orderpayment && orderpayment.status == "Success") {
    //         return res.send("Already paid")
    //     }

    //     // Converting String into array
    //     let product_id = order.product_id
    //     product_id = product_id.replace(/'/g, '');
    //     product_id = JSON.parse(product_id)

    //     let product = await Product.findAll({ where: { id: product_id } }).catch(error => {
    //         console.log({ error })
    //         return res.status(400).json({ status: "fail", message: "Something Went Wronge" })
    //     })
    //     // Adding Product Ammount info a Variable 
    //     let productPrice = 0
    //     for (let i of product) {
    //         productPrice += i.price
    //     }
    //     // Checking Ammount is Proper or not 
    //     if (amount !== productPrice) {
    //         let result = await Order_payment.create({
    //             order_id, amount, method,
    //             status: "fail",
    //             payment_details: {
    //                 "message": "Ammount is Not Valid"
    //             }
    //         }, { transaction: t }).catch(async (error) => {
    //             console.log({ error })
    //             await t.rollback()
    //             return res.status(400).send({ status: "fail", "message": "retry" })
    //         })
    //         // Updating Order Payment Status
    //         await OrderSir.update({ payment_status: "Fail", order_status: false }, { where: { id: order_id }, transaction: t }).catch(async (error) => {
    //             console.log({ error })
    //             await t.rollback()
    //             return res.status(400).send({ status: "fail", "message": "retry" })
    //         })

    //         await t.commit()
    //         return res.send(result)
    //     }
    //     // If everything is Ok Then This 
    //     let result = await Order_payment.create({
    //         order_id, amount, method,
    //         status: "Success",
    //         payment_details: {
    //             "message": "Ammount Paid SuccessFully"
    //         }
    //     }, { transaction: t }).catch(async (error) => {
    //         await t.rollback()
    //         console.log({ error })
    //         return res.status(400).send({ status: "fail", "message": "retry" })
    //     })
    //     // Updating Order Payment Status
    //     await OrderSir.update({ payment_status: "SuccessFull", order_status: true }, { where: { id: order_id }, transaction: t }).catch(async (error) => {
    //         await t.rollback()
    //         console.log({ error })
    //         return res.status(400).send({ status: "fail", "message": "retry" })
    //     })

    //     await t.commit()
    //     return res.send(result)
    // }

    static async paymentPay(req, res) {
        let valid = validate(req.body)
        if (valid) { return res.status(400).send(valid.message) }

        let order = await OrderProduct.findOne({ where: { order_id: req.body.order_id } }).catch(error => {
            return res.status(400).send(error)
        })
        let { order_id, amount } = req.body
        let t = await sequelize.transaction()
        // this is loop hole in this 
        if (order.tottal_ammount !== amount) {
            return res.status(400).send({ status: "payment fail", message: "pls try again" })
        }
        if (req.body.status === "fail") {

            let result = await Order_payment.create(req.body, { transaction: t }).catch(async (error) => {
                await t.rollback()
                return res.status(400).send(error)
            })

            await OrderSir.update({ payment_status: "Fail", order_status: 2 }, { where: { id: order_id }, transaction: t }).catch(async (error) => {
                await t.rollback()
                return res.status(400).send({ status: "fail", "message": "retry" })
            })

            await t.commit()

            return res.status(200).send({ status: "fail", "message": result })
        }

        let result = await Order_payment.create(req.body, { transaction: t }).catch(async error => {
            await t.rollback()
            return res.status(400).send(error)
        })
        // Updating Order Payment Status
        await OrderSir.update({ payment_status: "SuccessFull", order_status: 1 }, { where: { id: order_id }, transaction: t }).catch(async (error) => {
            await t.rollback()
            return res.status(400).send({ status: "fail", "message": "retry" })
        })

        await t.commit()

        return res.status(400).send({ status: "success", "message": result })
    }
    // ###################### Get PAyment Status (Pending)##############################
    static async getPayment(req, res) {
        let order = await OrderSir.findAll({ where: { userId: req.user.id } })
        let payment = await Order_payment.findAll()
        return res.send(order)
    }
    // ###################### Delivery Status ##############################

    // Get Product delivery status 
    static async GetDeliveryStatus(req, res) {
        let schema = Joi.object({
            order_id: Joi.number().required()
        })
        let { error } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).send({ message: error.message })
        }

        let order = await OrderProduct.findOne({ where: { order_id: req.body.order_id }, include: OrderSir })

        return res.status(200).send(order)
    }
    // ######################## Confirm Order ########################

    static async ConfirmOrder(req, res) {
        let schema = Joi.object({
            order_id: Joi.number().required()
        })
        let { error } = schema.validate(req.body, { abortEarly: true })
        if (error) { return res.status(400).send({ error: error.message }) }

        let order = await OrderSir.findOne({ where: { id: req.body.order_id } })

        if (!order || order.order_status !== 0 || order.order_status == 2) {
            return res.send("Order Is Cancled")
        }

        let result = await OrderSir.update({ order_status: 1, delivery_status: "delivering", updatedBy: req.user.id }, { where: { id: order.id } }).catch(error => {
            return res.status(400).send({ error })
        })

        return res.send(result)
    }
    // ######################## Update delivery Location ########################

    static async UpdateDeliveryLocation(req, res) {
        let schema = Joi.object({
            order_id: Joi.number().required(),
            delivery_location: Joi.string().required()
        })
        let { error } = schema.validate(req.body, { abortEarly: true })
        if (error) { return res.status(400).send({ error: error.message }) }

        let order = await OrderSir.findOne({ where: { id: req.body.order_id } })

        if (!order || order.order_status !== 1) {
            return res.status(400).send({ error: "Order is Cancled" })
        }

        let result = await OrderSir.update({ delivery_location: req.body.delivery_location, updatedBy: req.user.id }, { where: { id: order.id } }).catch(error => {
            return res.status(400).send({ error })
        })

        return res.send({ result })
    }

    // Update Product delivery status 
    static async UpdateDeliveryStatus(req, res) {

        let schema = Joi.object({
            order_id: Joi.number().required(),
            delivery_status: Joi.string().required()
        })
        let { error } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).send({ message: error.message })
        }

        let order = await OrderSir.findOne({ where: { id: req.body.order_id } })

        if (order.order_status === 2 || order.order_status === 3 || order.delivery_status === "Cancle") {
            return res.status(400).send("Order is Cancled ")
        }

        if (order.order_status === 1 && order.delivery_status === "Delivered") {
            return res.status(400).send("Order is Delivered ")
        }

        if (req.body.delivery_status !== "Delivered") {
            let result = await OrderSir.update({ delivery_status: req.body.delivery_status, payment_status: "Cancle", updatedBy: req.user.id },
                { where: { id: order.id } }).catch(error => {
                    return res.status(400).send({ status: "Fail", error })
                })
            return res.status(200).send(result)
        }

        let result = await OrderSir.update({ delivery_status: req.body.delivery_status, payment_status: "SuccessFul", order_status: 1, updatedBy: req.user.id }, { where: { id: order.id } }).catch(error => {
            return res.status(400).send({ status: "Fail", error })
        })

        return res.status(200).send(result)
    }

    // ################## Admin Order list View ##########################
    static async AdminOrderList(req, res) {
        let search = { limit: 10 }

        search.offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        let order = await OrderSir.findAll(search)

        return res.send(order)
    }

    // ################## Admin Order list =Details View ##########################

    static async AdminAllUserOrder(req, res) {
        let schema = Joi.object({
            userId: Joi.number().required()
        })
        let { error } = schema.validate(req.body)
        if (error) { return res.status(400).send(error.message) }
        let order = await OrderSir.findAll({ where: { id: req.body.userId } })

        if (order[0] == null) {
            console.log(typeof order)
            return res.status(200).send("No Order Found")
        }
        return res.status(200).send({ order })
    }

    // ################## Admin Order list =Details View ##########################

    static async AdminOrderListDetails(req, res) {

        let schema = Joi.object({
            id: Joi.number().required()
        })

        let { error } = schema.validate(req.params, { abortEarly: false })
        if (error) { return res.send({ error: error.message }) }

        let order = await OrderProduct.findOne({ where: { order_id: req.params.id }, include: OrderSir })
        order.product_id = order.product_id.replace(/'/g, '')
        // Product id's In Array 
        let id = JSON.parse(order.product_id)

        order.Quantity = order.Quantity.replace(/'/g, '')
        order.Quantity = JSON.parse(order.Quantity)

        let product = await Product.findAll({
            where: { id }, raw: true, attributes: {
                exclude: ['userId', 'slug', 'stock', 'category', "createdAt", "updatedAt"]
            }
        })

        for (let i in product) {
            product[i].Quantity = order.Quantity[i]
        }

        return res.status(200).send({ order, product })
    }

    static async UserOrderList(req, res) {
        let search = { where: { userId: req.user.id } }
        search.limit = 10
        search.offset = req.query.page ? (req.query.page - 1) * 10 : 0;
        search.attributes = {
            exclude: ['userId', "updatedBy", "createdAt", "updatedAt"]
        }
        let order = await OrderSir.findAll(search)
        return res.send(order)
    }

    static async UserOrderListDetails(req, res) {
        let schema = Joi.object({
            id: Joi.number().required()
        })

        let { error } = schema.validate(req.params, { abortEarly: false })
        if (error) { return res.send({ error: error.message }) }

        let order = await OrderProduct.findOne({ where: { order_id: req.params.id }, include: OrderSir })

        // Checking User Is Valid Or Not 
        if (order.OrderSir.id !== req.user.id) {
            return res.status(400).send({ status: "fail", message: "No Product Found" })
        }

        order.product_id = order.product_id.replace(/'/g, '')
        // Product id's In Array 
        let id = JSON.parse(order.product_id)

        order.Quantity = order.Quantity.replace(/'/g, '')
        order.Quantity = JSON.parse(order.Quantity)

        let product = await Product.findAll({
            where: { id }, raw: true, attributes: {
                exclude: ['userId', 'slug', 'stock', 'category', "createdAt", "updatedAt"]
            }
        })

        for (let i in product) {
            product[i].Quantity = order.Quantity[i]
        }

        return res.status(200).send({ order, product })
    }

}
module.exports = OrderProducts