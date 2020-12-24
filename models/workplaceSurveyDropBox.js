const mongoose = require("mongoose");

const workplaceSurveyDropBoxSchema = new mongoose.Schema({
  dropBoxId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "workplaceSurveyDropBox",
  workplaceSurveyDropBoxSchema
);
