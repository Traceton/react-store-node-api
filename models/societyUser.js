const mongoose = require("mongoose");

const societyUserSchema = new mongoose.Schema({
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("societyUser", societyUserSchema);
