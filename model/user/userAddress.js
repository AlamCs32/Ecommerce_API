const { sequelize, Model, DataTypes } = require('../../config/dbConfig')

const joi = require('joi')
const { User } = require('./userModel')


// class User extends Model { }
class Address extends Model { }

Address.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id"
        }
    },
    name: {
        type: DataTypes.STRING(55)
    },
    address: {
        type: DataTypes.STRING(150)
    },
    pincode: {
        type: DataTypes.INTEGER
    },
    city: {
        type: DataTypes.STRING(150)
    },
    number: {
        type: DataTypes.INTEGER,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Address',
    tableName: 'Address'
})

Address.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
})

//  CREAING TABLE USING THIS METHOD []
// Address.sync({ force: true }).then(() => console.log("table is created")).catch(err => console.log(err))


function addressValidate(req) {
    let Schema = joi.object({
        name: joi.string(),
        address: joi.string(),
        city: joi.string(),
        number: joi.number(),
        pincode: joi.number(),
        userId: joi.number()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

function addressCreateValidate(req) {
    let Schema = joi.object({
        name: joi.string().required(),
        address: joi.string().required(),
        city: joi.string().required(),
        number: joi.number().required(),
        pincode: joi.number().required(),
        userId: joi.number()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = {
    Address, addressValidate, addressCreateValidate
}