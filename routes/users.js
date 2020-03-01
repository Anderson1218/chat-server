const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const usersController = require("../controllers/usersController");

//create a new user
router.post("/", usersController.createUser);

//get all users
router.get("/", auth, usersController.getAllUsers);

//update user
router.put("/:id", usersController.updateUser);

//delete a existing user
router.delete("/:id", usersController.deleteUser);

//login
router.post("/token", usersController.signin);

//# Profile of logged in user
// router.get("/me", auth, usersController.getUserProfile);

module.exports = router;
