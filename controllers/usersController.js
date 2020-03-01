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
    console.log("user's auto-generated ID:", user.id);
    res.send("uid is " + user.id);
  } catch (err) {
    res.status(405).send();
    console.log(err);
  }
};

module.exports.getAllUsers = async (req, res) => {
  console.log(req.headers);
  try {
    const data = await User.findAll();
    const users = data.map(user => user.dataValues);
    res.send(users);
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateUser = (req, res) => {
  User.update(
    { password: "kkkk" },
    {
      where: {
        email: "app2@gmail.com"
      }
    }
  )
    .then(() => {
      res.send("update password success");
    })
    .catch(err => console.log(err));
};

module.exports.deleteUser = (req, res) => {
  User.destroy({
    where: {
      email: "app2@gmail.com"
    }
  })
    .then(() => {
      console.log("Done");
      res.send("delete success");
    })
    .catch(err => console.log(err));
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("email and password shouldn't be empty");
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.send("user does not exist");
    }
    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      res.send("signin fail");
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
      res.send(token);
    }
  } catch (err) {
    res.send("something wrong");
  }
};
