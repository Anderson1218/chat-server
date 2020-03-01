const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({
      email: email,
      password: hash,
      role: "general"
    });
    delete user.dataValues.password;
    res.send(user.dataValues);
  } catch (err) {
    res.status(405).send(err.toString());
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Permission denied, please login as administrator");
    }
    const data = await User.findAll();
    const users = data.map(user => user.dataValues);
    users.forEach(user => {
      delete user.password;
    });
    res.send(users);
  } catch (err) {
    res.status(401).send(err.toString());
  }
};

//update user's password
module.exports.updateUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Permission denied, please login as administrator");
    }
    const { password } = req.body;
    const { id } = req.params;
    const hash = await bcrypt.hash(password, 8);
    const info = await User.update(
      { password: hash },
      {
        where: {
          id: id
        }
      }
    );
    res.json("Updating password success");
  } catch (err) {
    res.status(401).send(err.toString());
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Permission denied, please login as administrator");
    }
    const { id } = req.params;
    const info = await User.destroy({
      where: {
        id: id
      }
    });
    res.send("Deleting user success");
  } catch (err) {
    res.status(401).send(err.toString());
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password shouldn't be empty");
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("user not exist");
    }
    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      throw new Error("password is wrong");
    } else {
      const token = jwt.sign(
        {
          id: user.dataValues.id,
          email: user.dataValues.email,
          role: user.dataValues.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400 // expires in 24 hours
        }
      );
      res.json(token);
    }
  } catch (err) {
    res.status(401).send(err.toString());
  }
};
