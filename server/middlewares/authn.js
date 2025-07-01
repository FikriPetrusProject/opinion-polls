const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const isLogin = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) throw new Error("UNAUTHORIZED")

        token = token.split(" ")[1]
        let payload = verifyToken(token)

        let user = await User.findByPk(payload.id)
        if (!user) throw new Error("UNAUTHORIZED")

        req.user = payload
        next()

    } catch (error) { 
        next(error)
    }
}

module.exports = isLogin