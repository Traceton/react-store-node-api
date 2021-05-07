const mongoose = require("mongoose");

const muterPollDropBoxSchema = new mongoose.Schema({
  dropBoxId: {
    type: String,
    required: true,
  },
  dropBoxName: {
    type: String,
    required: true,
  },
  dropBoxQuestion: {
    type: String,
    required: true,
  },
  dropBoxPassword: {
    type: String,
    required: true,
  },
  dropBoxLocation: {
    type: String,
    required: false,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("muterPollDropBox", muterPollDropBoxSchema);
