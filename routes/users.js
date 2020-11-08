const express = require("express");
const mongoose = require("mongoose");
const router = express();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const User = require("../models/user");
const GridFsStorage = require("multer-gridfs-storage");
const methodOverride = require("method-override");
const fileSizeLimit = 500000;

// database
const mongoURI = process.env.DATABASE_URL;
// connection
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// init gfs
let gfs;

conn.on("error", (error) => {
  console.error(error);
});
conn.once("open", () => {
  console.log("user router connection connected");
  // init gfs stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "profilePics",
  });
});

// create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = req.body.userId;
        const fileInfo = {
          filename: filename,
          bucketName: "profilePics",
        };
        resolve(fileInfo);
      });
    });
  },
  options: {
    useUnifiedTopology: true,
  },
});
// TESTING MAX FILE SIZE FOR MULTER UPLOADS, TESTING.
const upload = multer({
  storage: storage,
  limits: { fileSize: fileSizeLimit },
});

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
  next();
};

// check if user account already exists,
let checkIfUserExists = async (req, res, next) => {
  // console.log(req.body);
  let userWithUsernameAlready;
  let userWithEmailAlready;
  userWithUsernameAlready = await User.find({ username: req.body.username });
  userWithEmailAlready = await User.find({
    email: req.body.email,
  });

  if (userWithUsernameAlready.length >= 1 || userWithEmailAlready.length >= 1) {
    console.log("username or email already exists");
  } else {
    res.user = await new User({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      userId: req.body.userId,
      streetId: req.body.streetId,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      storeListings: req.body.storeListings,
      messageInbox: req.body.messageInbox,
      profilePreferences: req.body.profilePreferences,
      userBio: req.body.userBio,
    });
  }

  // STILL WORKING ON THIS FUNCTION AND VERIFYING IF THE ACCOUNT EXISTS ALREADY OR NOT
  next();
};

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
router.post(
  "/",
  upload.single("profilePic"),
  checkIfUserExists,
  async (req, res) => {
    // make sure the account doesnt already exist here.
    console.log(req.file.size);
    try {
      const newUser = await res.user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
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

router.delete("/deleteProfilePic/:userId", async (req, res) => {
  //
  try {
    gfs.find({ filename: req.params.userId }).toArray((err, files) => {
      // check if files exist
      if (!files || files.length === 0) {
        return res.status(404).json({ err: "no files found" });
      } else {
        let id = files[0]._id;
        // console.log(files[0]);
        const obj_id = new mongoose.Types.ObjectId(id);
        gfs.delete(obj_id);
        res.status(201).json("Profile picture deleted");
      }
    });
  } catch (error) {
    res.status(500).json("couldnt delete");
  }
});

// update a single user by username
router.patch(
  "/updateUser/:username",
  findUserByUsername,
  upload.single("profilePic"),
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
    if (req.body.streetAddress != null) {
      res.user.streetAddress = req.body.streetAddress;
    }
    if (req.body.city != null) {
      res.user.city = req.body.city;
    }
    if (req.body.zipCode != null) {
      res.user.zipCode = req.body.zipCode;
    }
    if (req.body.storeListings != null) {
      res.user.storeListings = req.body.storeListings;
    }
    if (req.body.messageInbox != null) {
      res.user.messageInbox = req.body.messageInbox;
    }
    if (req.body.profilePreferences != null) {
      res.user.profilePreferences = req.body.profilePreferences;
    }
    if (req.body.userBio != null) {
      res.user.userBio = req.body.userBio;
    }
    console.log(req.file.size);
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

// @route get /profilePics/:userId
// @desc display profile picture found by user id
router.get("/profilePics/:userId", (req, res) => {
  console.log(" user request recieved");
  gfs.find({ filename: req.params.userId }).toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "no files found" });
    }
    // files were found
    let gotData = false;
    console.log("user image found");
    files.map(async (file) => {
      let downloadStream = await gfs
        .openDownloadStreamByName(file.filename)
        .pipe(res);
      // return console.log("user image returned");
      downloadStream.on("end", () => {
        test.ok(gotData);
        console.log("stream ended.");
      });
    });
  });
});

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
router.use(methodOverride("_method"));
module.exports = router;
