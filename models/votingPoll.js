const mongoose = require("mongoose");

const votingPollSchema = new mongoose.Schema({
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("votingPoll", votingPollSchema);
