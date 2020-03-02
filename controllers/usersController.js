const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password shouldn't be empty");
    }
    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({
      email: email,
      password: hash,
      role: "general"
    });
    res.json("Creating user success");
  } catch (err) {
    res.status(405).json("Creating user fail");
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
    res.json(users);
  } catch (err) {
    res.status(401).json(err.toString());
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
    res.status(401).json(err.toString());
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
    res.json("Deleting user success");
  } catch (err) {
    res.status(401).json(err.toString());
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
    res.status(401).json(err.toString());
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      throw new Error("fail to get the user's profile");
    }
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(401).json(err.toString());
  }
};
