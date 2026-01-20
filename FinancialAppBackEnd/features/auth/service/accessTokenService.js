const jwt = require("jsonwebtoken");

function createAccessToken(userId, roles) {
  return jwt.sign({ id: userId, roles: roles }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

exports.generateAccessToken = (userId, roles) => {
  return createAccessToken(userId, roles);
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
