const { comparePwd } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")
const { User } = require("../models")
class UserController {

    static async login(req, res, next) {
        try {
            let { email, password } = req.body
            let user = await User.findOne({
                where: { email }
            })

            if (!user) throw new Error("INVALID_CREDENTIAL")
            if (!comparePwd(password, user.password)) throw new Error("INVALID_CREDENTIAL")

            let payload = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }

            payload = signToken(payload)

            res.status(200).json({ "access_token": payload })
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {

            let { name, email, password } = req.body

            let data = await User.create({
                name, email, password
            })

            res.status(201).json({
                "message": "Successfully registered"
            })

        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController