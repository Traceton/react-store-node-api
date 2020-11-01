const express = require("express");
const mongoose = require("mongoose");
const router = express();

// @route get /
// @desc loads form
router.get("/", async (req, res) => {
  //   const items = await InventoryItem.find();
  try {
    res.status(201).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
