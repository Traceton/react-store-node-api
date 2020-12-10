const mongoose = require("mongoose");

const votingPollAnswersSchema = new mongoose.Schema({
  pollId: {
    type: String,
    required: true,
  },
  pollCategory: {
    type: String,
    required: true,
  },
  pollAnswerUserId: {
    type: String,
    required: true,
  },
  pollAnswerUserUsername: {
    type: String,
    required: true,
  },
  pollAnswer: {
    type: Array,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("VotingPollAnswer", votingPollAnswersSchema);
