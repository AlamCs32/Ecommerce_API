const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const bcrypt = require('bcrypt')
const joi = require('joi')


// class User extends Model { }
class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    profile: {
        type: DataTypes.STRING(150)
    },
    username: {
        type: DataTypes.STRING(55),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(55),
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(55),
        allowNull: true
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    googleId: {
        type: DataTypes.INTEGER
    },
    user_type: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'User'
})

//  CREAING TABLE USING THIS METHOD []
// User.sync({ force: true }).then(() => console.log("tables is created ")).catch(err => console.log(err))

User.beforeCreate(async (user, options) => {
    let salt = await bcrypt.genSalt(11)
    user.password = await bcrypt.hash(user.password, salt)
})

User.beforeUpdate(async (user, options) => {
    let salt = await bcrypt.genSalt(11)
    user.password = await bcrypt.hash(user.password, salt)
})

function UserValidate(req) {
    let Schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        address: joi.string().required(),
        phone: joi.number().required(),
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = {
    User, UserValidate
}