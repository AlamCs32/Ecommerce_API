const nodemail = require('nodemailer')
require('dotenv').config()

const transport = nodemail.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.userEmail,
        pass: process.env.userPass
    },
    tls: {
        ciphers: process.env.cipher
    }
})

let sendMail = (email, sub = 'razy fasion', message = '<h1>Welcome to razy Fasion!</h1>') => {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from: process.env.userEmail,
            to: email,
            subject: sub,
            html: message
        }, (error, res) => {
            if (error) {
                return reject(error)
            }
            return resolve(res)
        })
    })
}

// Multeple email send 
let multipleSendMail = (sub = 'razy fasion', message = '<h1>Welcome to razy Fasion!</h1>', email) => {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from: process.env.userEmail,
            to: email,
            subject: sub,
            html: message
        }, (error, res) => {
            if (error) {
                return reject(error)
            }
            return resolve(res)
        })
    })
}

module.exports = { sendMail, multipleSendMail }