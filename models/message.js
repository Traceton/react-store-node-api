const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  senderUserId: {
    type: String,
    required: true,
  },
  recieverUserId: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  messageBody: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("message", userSchema);
