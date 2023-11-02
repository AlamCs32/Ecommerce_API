const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const joi = require('joi')
const { User } = require('../user/userModel')
const { Category } = require('../category/category')

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        primaryKey: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    slug: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        // reference: {
        //     model: "User",
        //     key: "id",
        // },
    },
    title: {
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: [false, "gender is null enter product gender type!"]
    },
    size: {
        type: DataTypes.STRING,
        allowNull: [false, "Pls Enter Size"]
    },
    MRP: {
        type: DataTypes.INTEGER,
    },
    Discount: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    stock: {
        type: DataTypes.INTEGER,
    },
    category: {
        type: DataTypes.INTEGER,
    },
    thumbnail: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.JSON,
    },
    description: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: "Product",
    tableName: "product"
})

Product.belongsTo(User, {
    foreignKey: "userId",
    targetKey: 'id',
    // as:"user"
})
Product.belongsTo(Category, {
    foreignKey: "category",
    targetKey: 'id',
})
//  sequelize.query("select * from product",{type:QueryTypes.SELECT,logging:false}).then(i => console.log(i)).catch(err=> console.log({some_erro:err}))

// Product.sync({ force: true }).then(() => console.log('database is connect')).catch(err => console.log(err))

let addJoi = (req) => {
    let Schema = joi.object({
        product: joi.string(),
        title: joi.string().min(1).required(),
        description: joi.string().min(1).required(),
        color: joi.string().min(1).required(),
        stock: joi.number().required(),
        gender: joi.string().required(),
        size: joi.string().required(),
        MRP: joi.number().required(),
        Discount: joi.number().required(),
        price: joi.number(),
        category: joi.string().required(),
        specification:joi.object().required()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}
// Product.update({ category: 1 }, { where: { id: 12 } }).then(res => console.log(res)).catch(error => console.log(error))
// For updating Product 
let updateJoi = (req = null) => {
    if (req == null) {
        return false
    }
    let Schema = joi.object({
        product: joi.string(),
        title: joi.string(),
        color: joi.string(),
        stock: joi.number(),
        gender: joi.string(),
        description: joi.string(),
        size: joi.string(),
        MRP: joi.number(),
        Discount: joi.number(),
        price: joi.number(),
        category: joi.string()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}


module.exports = { Product, updateJoi, addJoi }