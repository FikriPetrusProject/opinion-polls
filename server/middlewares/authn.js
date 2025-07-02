const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("UNAUTHORIZED");
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      throw new Error("UNAUTHORIZED");
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      throw new Error("UNAUTHORIZED");
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username || user.name,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isLogin;
