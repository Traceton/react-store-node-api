const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemImageName: {
    type: String,
    required: true,
  },
  itemImageData: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("inventoryItem", inventoryItemSchema);
