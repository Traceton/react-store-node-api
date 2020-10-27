const express = require("express");
const mongoose = require("mongoose");
const router = express();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const InventoryItem = require("../models/inventoryItem");
const User = require("../models/user");
const GridFsStorage = require("multer-gridfs-storage");
const methodOverride = require("method-override");

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
  console.log("inventory item router connection connected");
  // init gfs stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
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
        const filename = req.body.itemId;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
  options: {
    useUnifiedTopology: true,
  },
});
const upload = multer({ storage });

// @route get /
// @desc loads form
router.get("/", async (req, res) => {
  const items = await InventoryItem.find();
  try {
    res.status(201).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BELOW CURRENTLY FINDS THE USER, NOW TO AUTHENTICATE IF USERS INFO IS CORRECT.

router.post(
  "/createNewItem/:userId/:password",
  upload.single("itemImage"),
  async (req, res) => {
    const user = await User.find({ userId: req.params.userId });
    const newInventoryItem = await new InventoryItem({
      itemId: req.params.itemId,
      itemName: req.body.itemName,
      itemCategory: req.body.itemCategory,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      itemPartNumber: req.body.itemPartNumber,
      itemsInStock: req.body.itemsInStock,
      itemLocation: req.body.itemLocation,
      itemShippingDistance: req.body.itemShippingDistance,
      itemYearCreated: req.body.itemYearCreated,
      itemMake: req.body.itemMake,
      itemModel: req.body.itemModel,
    });

    try {
      if (user[0] && user[0].password == req.params.password) {
        console.log(newInventoryItem);
        newInventoryItem.save();
        res.status(201).json(newInventoryItem);
      } else {
        return console.log("password or user id incorrect");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route post /upload
// @desc uploads file to database
router.post("/upload", upload.single("itemImage"), async (req, res) => {
  const newInventoryItem = await new InventoryItem({
    // fix filenameeeeee
    itemId: req.body.itemId,
    itemName: req.body.itemName,
    itemCategory: req.body.itemCategory,
    itemDescription: req.body.itemDescription,
    itemPrice: req.body.itemPrice,
    itemPartNumber: req.body.itemPartNumber,
    itemsInStock: req.body.itemsInStock,
    itemLocation: req.body.itemLocation,
    itemShippingDistance: req.body.itemShippingDistance,
    itemYearCreated: req.body.itemYearCreated,
    itemMake: req.body.itemMake,
    itemModel: req.body.itemModel,
  });

  try {
    newInventoryItem.save();
    res.status(201).json(newInventoryItem);

    // res.json({ file: req.file });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// @route get /files
// @desc display all files in JSON
router.get("/files", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "no files found" });
    }
    // files were found
    return res.status(201).json(files);
  });
});

// @route get /files/:filename
// @desc display file by filename
router.get("/files/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "file not found" });
    }
    res.status(201).json(files);
  });
});

// get all files by item category
router.get("/items/:itemCategory", async (req, res) => {
  const category = req.params.itemCategory;
  const filteredItems = await InventoryItem.find({ itemCategory: category });
  try {
    res.status(201).json(filteredItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route get /images
// @desc display all images
router.get("/images", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "no files found" });
    }
    // files were found
    files.map((file) => {
      return gfs.openDownloadStreamByName(file.filename).pipe(res);
    });
  });
});

// @route get /images/:filename
// @desc display image by filename
router.get("/images/:filename", (req, res) => {
  gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ err: "file not found" });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.use(methodOverride("_method"));
module.exports = router;
