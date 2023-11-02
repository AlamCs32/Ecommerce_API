const { User, UserValidate } = require('../model')
const bcrypt = require('bcrypt')
const TokenService = require('../service/TokenService')
const joi = require('joi')
const { sendMail } = require('../config/nodemailer')
require('dotenv').config()

class Logger {
    //  Redister Api
    static async Singup(req, res) {
        let valid = UserValidate(req.body)
        if (valid) {
            req.flash("fields", "all field are required")
            return res.status(200).redirect('/singup')
        }
        let { username, email, password, address, phone } = req.body

        let user = await User.findOne({ where: { email } })

        if (user) {
            req.flash("message", "user is present pls login")
            return res.status(200).redirect('/login')
        }

        let result = await User.create({ username, email, password, address, phone })
            .catch(error => {
                req.flash("AsynError", error)
                return res.status(200).redirect('/singup')
            })

        sendMail(email)
        let token = TokenService.sing({ userId: result.id })

        return res.cookie("jwt", token).status(200).redirect('/')
    }
    //  Login Api
    static async Login(req, res) {
        let Schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            req.flash("fields", "all field are required")
            return res.status(200).redirect('/login')
        }

        let { email, password } = req.body

        let user = await User.findOne({ where: { email } })

        if (!user) {
            req.flash("message", "user is not present pls Singin")
            return res.status(200).redirect('/singup')
        }

        let matchPasswd = await bcrypt.compare(password, user.password).catch(error => {
            req.flash("AsynError", "internal server Error")
            return res.status(200).redirect('/login')
        })

        if (!matchPasswd) {
            req.flash("message", "Email or Password in incorrect! pls try again")
            return res.status(200).redirect('/login')
        }
        // // sending Email
        let mail = await sendMail(user.email).catch(error => {
            return res.send({ error })
        })
        let token = TokenService.sing({ userId: user.id })

        return res.cookie("jwt", token).status(200).redirect('/')

    }
    // Change Password 
    static async ChangePassword(req, res) {
        let Schema = joi.object({
            password: joi.string().email().required(),
            confirmPassword: joi.string().required()
        })

        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            req.flash("fields", "all field are required!")
            return res.status(200).redirect('/changepassword')
        }
        let { password, confirmPassword } = req.body


        if (password !== confirmPassword) {
            req.flash("fields", "password not match!")
            return res.status(200).redirect('/changepassword')
        }

        let result = await User.update({ password }, { where: { id: req.user.id }, individualHooks: true }).catch(error => {
            req.flash("AsynError", "internal server Error")
            return res.status(200).redirect('/changepassword')
        })
        req.flash("message", "password change Successfully!")
        return res.status(200).redirect('/login')
    }

    static resetEmail = async (req, res) => {
        //  joi Validation
        let Schema = joi.object({
            email: joi.string().email().required()
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            req.flash("fields", "all field are required!")
            return res.status(200).redirect('/resetmail')
        }

        let user = await User.findOne({ where: { email: req.body.email } }).catch(error => {
            req.flash("AsynError", "internal server Error")
            return res.status(400).redirect('/resetmail')
        })

        let secret = user.id + process.env.secretKey
        let token = TokenService.sing({ userId: user.id }, secret, "1m")
        // Link For Forget Password 
        const link = `http://127.0.0.1:3000/reset/${user.id}/${token}`

        //  sending Email Pending
        sendMail(user.email, "Change Password", link)

        return res.status(200).send("pls Check your Email!")
    }

    static forgetPasswdset = async (req, res) => {
        let Schema = joi.object({
            password: joi.string().required(),
            ConfirmPassword: joi.string().required(),
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            req.flash("fields", "all field are required!")
            return res.status(200).redirect('/reset')
        }

        let { id, token } = req.params
        //  Comparing Password 
        let { password, ConfirmPassword } = req.body
        if (password !== ConfirmPassword) {
            req.flash("fields", "all field are required!")
            return res.status(200).redirect('/resetemail')
        }
        // User findind 
        let user = await User.findOne({ where: { id } }).catch(error => {
            req.flash("AsynError", "internal server Error")
            return res.status(400).redirect('/resetmail')
        })
        if (!user) {
            req.flash("AsynError", "internal server Error")
            return res.status(400).redirect('/resetmail')
        }
        //  Creating Secret key For token
        let secret = user.id + process.env.secretKey
        try {
            TokenService.verify(token, secret)
            let passwdReset = await User.update(password, { where: { id: user.id }, individualHooks: true }).catch(
                error => {
                    req.flash("AsynError", "internal server Error")
                    return res.status(400).redirect('/resetmail')
                })
            return res.status(200).json({ status: true, passwdReset })
        } catch (error) {
            req.flash("message", "something went Wronge")
            return res.status(200).redirect('/resetemail')
        }
    }
    //  logOut Function
    static async logout(req, res) {
        if (req.cookies.jwt) {
            req.session = null
            return res.clearCookie().redirect('/login')
        }
        return res.redirect('/login')
    }

    static async UserProfile(req, res) {
        let user = await User.findOne({ where: { id: req.user.id } })
        return res.status(200).send(user)
    }

}

module.exports = Logger