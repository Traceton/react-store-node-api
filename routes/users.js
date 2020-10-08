const express = require("express");
const mongoose = require("mongoose");
const router = express();
const multer = require("multer");
const upload = multer();
const User = require("../models/user");

// find user middleware function
let findUserById = async (req, res, next) => {
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

let findUserByUsername = async (req, res, next) => {
  let user;
  user = await User.find({ username: req.params.username });

  try {
    if (!user) {
      res.status(404).json({ message: "user not found" });
      console.log(`user not found in findByUsername`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`error in findByUsername`);
  }

  res.user = user[0];

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
router.get("/:id", findUserById, (req, res) => {
  try {
    res.status(201).json(res.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user by username
router.get("/login/:username", findUserByUsername, async (req, res) => {
  try {
    res.status(201).json(res.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a single user
router.post("/", upload.single(), async (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    userId: req.body.userId,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete a single user
router.delete("/:id", findUserById, async (req, res) => {
  try {
    await res.user.remove();
    res.status(201).json({ message: "user was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// update a single user by id
router.patch("/:id", findUserById, async (req, res) => {
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

// update a single user by username
router.patch(
  "/updateUser/:username",
  upload.single(),
  findUserByUsername,
  async (req, res) => {
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
    console.log(`patch -> ${res.user}`);
    try {
      const updatedUser = await res.user.save((err) => {
        if (err) {
          console.log(err);
          return;
        }
      });

      res.status(201).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
