let jwt = require('jsonwebtoken')
require('dotenv').config()

class TokenService {
    //  Generating Token
    static sing(payload, secret = process.env.secretKey, expire = "1d") {
        return jwt.sign(payload, secret, { expiresIn: expire })
    }
    //  Verifying Token 
    static verify(Token, secret = process.env.secretKey) {
        return jwt.verify(Token, secret)
    }
}

module.exports = TokenService