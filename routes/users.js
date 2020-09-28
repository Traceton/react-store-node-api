const express = require("express");
const router = express();
const User = require("../models/user");

// find user middleware function
let findUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Could not find user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
};

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get single user by id
router.get("/:id", findUser, (req, res) => {
  try {
    res.status(201).json(res.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// create a single user
router.post("/", async (req, res) => {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete a single user
router.delete("/:id", findUser, async (req, res) => {
  try {
    await res.user.remove();
    res.status(201).json({ message: "user was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// update a single user
router.patch("/:id", findUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  try {
    const updatedUser = await res.user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
