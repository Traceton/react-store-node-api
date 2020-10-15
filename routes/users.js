const express = require("express");
const router = express();
const multer = require("multer");
const upload = multer();
const User = require("../models/user");

let findUserByUsername = async (req, res, next) => {
  let user;
  try {
    user = await User.find({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: "user not found" });
      console.log(`user not found in findByUsername`);
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`error in findByUsername`);
  }
  res.user = user[0];
  console.log(`req.params.username-> ${req.params.username}`);
  console.log(`findbyusername res.user -> ${res.user}`);

  next();
};

let verifyUserByUsernameAndPassword = async (req, res, next) => {
  let user;
  try {
    user = await User.find({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: "user not found" });
      console.log(`user not found in findByUsername`);
      return;
    } else if (
      req.params.username === user[0].username &&
      req.params.password === user[0].password
    ) {
      res.user = user[0];
    } else {
      res.status(404).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`error in findByUsername`);
  }

  console.log(`req.params.username-> ${req.params.username}`);
  console.log(`findbyusername res.user -> ${res.user}`);

  next();
};

// check if user account already exists,
// let checkIfUserExists = async (req, res, next) => {
//   let user =
//   next();
// };

// this call should only return public contact info.
// get public info user by username
router.get("/login/publicProfile/:username", findUserByUsername, (req, res) => {
  const publicProfile = {
    username: res.user.username,
    firstName: res.user.firstName,
    lastName: res.user.lastName,
    email: res.user.email,
    phone: res.user.phone,
  };
  try {
    res.status(201).json(publicProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// login user with username and passsword
router.get(
  "/login/:username/:password",
  verifyUserByUsernameAndPassword,
  (req, res) => {
    try {
      res.status(201).json(res.user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

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
    let userWithEmailAlready = User.find({ email: req.body.email });
    let userWithUsernameAlready = User.find({ username: req.body.username });

    if (!userWithEmailAlready && !userWithUsernameAlready) {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } else if (userWithEmailAlready) {
      res.status(500).json("Account with that email already exists");
    } else if (userWithUsernameAlready) {
      res.status(500).json("Account with that username already exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// // delete a single user
router.delete(
  "/delete/:username/:password",
  verifyUserByUsernameAndPassword,
  async (req, res) => {
    try {
      await res.user.remove();
      res.status(201).json({ message: "user was deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// update a single user by username
router.patch(
  "/updateUser/:username",
  findUserByUsername,
  upload.none(),
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
    if (req.body.phone != null) {
      res.user.phone = req.body.phone;
    }
    try {
      const updatedUser = await res.user.save((err, doc) => {
        if (err) {
          console.log(err);
          return;
        } else if (doc) {
          return res.status(201).json(res.user);
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// find user middleware function
// let findUserById = async (req, res, next) => {
//   let user;
//   try {
//     user = await User.findById(req.params.id);
//     if (!user) {
//       res.status(404).json({ message: "Could not find user" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   res.user = user;
//   next();
// };

// // get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(201).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// get single user by id
// router.get("/:id", findUserById, (req, res) => {
//   try {
//     res.status(201).json(res.user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// update a single user by id
// router.patch("/:id", upload.single(), findUserById, async (req, res) => {
//   if (req.body.firstName != null) {
//     res.user.firstName = req.body.firstName;
//   }
//   if (req.body.lastName != null) {
//     res.user.lastName = req.body.lastName;
//   }
//   if (req.body.username != null) {
//     res.user.username = req.body.username;
//   }
//   if (req.body.password != null) {
//     res.user.password = req.body.password;
//   }
//   if (req.body.email != null) {
//     res.user.email = req.body.email;
//   }
//   try {
//     const updatedUser = await res.user.save();
//     res.status(201).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
