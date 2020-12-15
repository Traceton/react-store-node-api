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
  pollTitle: {
    type: String,
    required: true,
  },
  pollCategory: {
    type: String,
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
    default: Date.now(),
  },
  pollType: {
    type: String,
    required: true,
  },
  requiredPollAnswersToEnd: {
    type: String,
    required: true
  }
  // single question poll below
  singleQuestionPollQuestion: {
    type: String,
    required: false,
  },
  singleQuestionPollAnswerChoices: {
    type: Array,
    required: false,
  },
  // multiple question poll/ form below
  multipleQuestionPollQuestions: {
    type: Array,
    required: false
  },
  multipleQuestionPollAnswerChoices: {
    type: Array,
    required: false
  },

});

module.exports = mongoose.model("votingPoll", votingPollSchema);
