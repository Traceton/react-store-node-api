const express = require("express");
const mongoose = require("mongoose");
const router = express();

const WorkplaceSurvey = require("../models/workplaceSurvey");
const DropBox = require("../models/workplaceSurveyDropBox");
const DropBoxAnswer = require("../models/workplaceSurveyDropBoxAnswer");

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

// get drop box answers by id if password for the drop box is correct.
router.get(
  "/dropBox/getAnswersByIdAndPassword/:boxId/:boxPassword",
  async (req, res) => {
    const dropBox = await dropBox.find({
      dropBoxId: req.params.boxId,
    });
    const answers = await DropBoxAnswer.find({
      dropBoxId: req.params.boxId,
    });

    try {
      if (dropBox && dropBox.dropBoxPassword === req.params.boxPassword) {
        return res.status(201).json(answers);
      } else {
        res.status(404).json("incorrect box id or password");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// create new drop box
router.post("/dropBox/createNewDropBox", async (req, res) => {
  const dropBox = await new DropBox({
    dropBoxId: req.body.dropBoxId,
    dropBoxName: req.body.dropBoxName,
    dropBoxPassword: req.body.dropBoxPassword,
    dropBoxLocation: req.body.dropBoxLocation,
  });
  try {
    const newDropBox = await dropBox.save();
    console.log(newDropBox);
    res.status(201).json(newDropBox);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/dropBox/createNewDropBoxAnswer", async (req, res) => {
  const answer = await new DropBoxAnswer({
    dropBoxId: req.body.dropBoxId,
    dropBoxAnswer: req.params.dropBoxAnswer,
  });
  try {
    const newAnswer = await answer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete drop box and drop box answers using id and password
router.delete(
  "/dropBox/deleteDropBox/:boxId/:boxPassword",
  async (req, res) => {
    const dropBox = await dropBox.find({
      dropBoxId: req.params.boxId,
    });
    try {
      if (dropBox && dropBox.dropBoxPassword === req.params.boxPassword) {
        dropBox.remove();
        res.status(201).json("Drop Box Deleted");
      } else {
        res.status(404).json("incorrect box id or password");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
