const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  // x-token headers
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request",
    });
  }

  try {
    const { uid, name, role_id } = jwt.verify(token, process.env.SECRET_KEY);
    req.uid = uid;
    req.name = name;
    req.role_id = role_id;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
  next();
};

module.exports = {
  validateJWT,
};
