const express = require("express");
const mongoose = require("mongoose");
const router = express();

const WorkplaceSurvey = require("../models/workplaceSurvey");

router.get("/", async (req, res) => {
  const surveys = await WorkplaceSurvey.find();
  try {
    res.status(201).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
