const mongoose = require("mongoose");

const workPlaceSurveySchema = new mongoose.Schema({
  surveyId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("workplaceSurvey", workPlaceSurveySchema);
