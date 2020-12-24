const express = require("express");
const mongoose = require("mongoose");
const router = express();

const WorkplaceSurvey = require("../models/workplaceSurvey");
const DropBox = require("../models/workplaceSurveyDropBox");

// get all workplace surveys
router.get("/", async (req, res) => {
  const surveys = await WorkplaceSurvey.find();
  try {
    res.status(201).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all drop boxes
router.get("/dropBox", async (req, res) => {
  const dropBoxes = await DropBox.find();
  try {
    res.status(201).json(dropBoxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
