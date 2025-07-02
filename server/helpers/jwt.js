const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET_JWT;

if (!SECRET) {
  throw new Error("Missing SECRET_JWT in environment variables");
}

const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" }); // Optional: add expiration
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
