const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  console.log("auth");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email, role } = decodedToken;
    console.log(id, email, role);
    // req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("err");
  }
};
