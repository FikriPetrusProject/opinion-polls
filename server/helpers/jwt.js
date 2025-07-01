const jwt = require("jsonwebtoken")

const signToken = (payload) => {
    const secret = process.env.SECRET_JWT
    const token = jwt.sign(payload, secret)
    return token
}

const verifyToken = (token) => {
    const secret = process.env.SECRET_JWT
    const decode = jwt.verify(token, secret)
    return decode
}

module.exports = {
    signToken,
    verifyToken
}