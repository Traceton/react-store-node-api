const mongoose = require("mongoose");

const votingPollSchema = new mongoose.Schema({
  pollId: {
    type: String,
    required: true,
  },
  pollPosterUserId: {
    type: String,
    required: true,
  },
  pollPosterUserUsername: {
    type: String,
    required: true,
  },
  pollType: {
    type: String,
    required: true,
  },
  pollTitle: {
    type: String,
    required: true,
  },
  pollCategory: {
    type: String,
    required: true,
  },
  pollRequiredVotes: {
    type: String,
    required: true,
  },
  pollQuestion: {
    type: String,
    required: true,
  },
  pollAnswerChoices: {
    type: Array,
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("votingPoll", votingPollSchema);
