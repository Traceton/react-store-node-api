const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: false,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemCategory: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
    required: false,
  },
  itemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  itemPartNumber: {
    type: Number,
    required: false,
  },
  itemsInStock: {
    type: Number,
    required: true,
  },
  itemLocation: {
    type: String,
    required: false,
  },
  itemShippingDistance: {
    type: Number,
    required: true,
    default: 0,
  },
  itemYearCreated: {
    type: Number,
    required: false,
  },
  itemMake: {
    type: String,
    required: false,
  },
  itemModel: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("inventoryItem", inventoryItemSchema);
