let isAuthorize = (...role) => {
    return (req, res, next) => {

        if (!role.includes(req.user.user_type)) {
            return res.status(400).send("<h1>You are not Allow to access this Service!</h1>")
        }
        next()
    }
}
module.exports = isAuthorize