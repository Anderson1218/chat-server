const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email, role } = decodedToken;
    const user = { id, email };
    user.isAdmin = role === "admin";
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("invalid token");
  }
};
