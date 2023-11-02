let { User } = require('../model')
let TokenService = require('../service/TokenService')

async function auth(req, res, next) {
    let token = req.cookies.jwt
    if (!token) {
        req.flash("message", "pls Login")
        return res.status(200).redirect('/login')
    }
    let { userId } = TokenService.verify(token)
    req.user = await User.findOne({
        where: { id: userId }, attributes: {
            exclude: ['password']
        }
    })
    next()
}

module.exports = auth