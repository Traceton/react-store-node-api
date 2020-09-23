const express = require("express");
const router = express();
const multer = require("multer");
const InventoryItem = require("../models/inventoryItem");

const storage = multer.diskStorage({
  destination: "images",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// find inventory item by id middleware

let findInventoryItem = async (req, res, next) => {
  try {
    let inventoryItem = await InventoryItem.find(
      {},
      {
        itemName: 1,
        itemImageName: 1,
        itemImageData: 1,
      }
    );
    res.inventoryItem = inventoryItem;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  next();
};

// location route for the images saved by multer
router.use("/images", express.static("images"));

// get all inventory items
router.get("/", async (req, res) => {
  let inventoryItems = await InventoryItem.find();
  try {
    res.send(inventoryItems);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// get single inventory item by image name
router.get("/:id", findInventoryItem, (req, res) => {
  try {
    res.send(res.inventoryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create single inventory item
router.post("/", upload.single("itemImage"), async (req, res) => {
  //   console.log(req.file);

  let inventoryItem = new InventoryItem({
    itemName: req.body.itemName,
    itemImageName: req.file.originalname,
    itemImageData: req.file.path,
  });
  try {
    inventoryItem.save();
    res.send(inventoryItem);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
