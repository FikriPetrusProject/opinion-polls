const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw { name: "UNAUTHORIZED", message: "Access token required" };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw { name: "UNAUTHORIZED", message: "Invalid token format" };
    }

    const payload = verifyToken(token);

    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "UNAUTHORIZED", message: "User not found" };
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username || user.name, // if available
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error = { name: "UNAUTHORIZED", message: "Invalid or expired token" };
    }
    next(error);
  }
};

module.exports = isLogin;
