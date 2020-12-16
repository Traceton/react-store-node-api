const express = require("express");
const mongoose = require("mongoose");
const votingPoll = require("../models/votingPoll");
const router = express();
const VotingPoll = require("../models/votingPoll");
const VotingPollAnswer = require("../models/votingPollAnswers");

// gets all voting polls
router.get("/", async (req, res) => {
  const polls = await VotingPoll.find();
  try {
    res.status(201).json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get voting polls by type and category
router.get(
  "/pollsByTypeAndCategory/:pollType/:pollCategory",
  async (req, res) => {
    const pollsByTypeAndCategory = VotingPoll.find({
      pollType: req.params.pollType,
      pollCategory: req.params.pollCategory,
    });
    try {
      res.status(201).json(pollsByTypeAndCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// get all single question voting polls
router.get("/singleQPolls", async (req, res) => {
  const allSingleQuestionPolls = await votingPoll.find({
    pollType: "singleQuestion",
  });
  try {
    res.status(201).json(allSingleQuestionPolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all single question voting polls by category
router.get("/singleQPollsByCat/:category", async (req, res) => {
  const singleQuestionPollsByCategory = await votingPoll.find({
    pollType: "singleQuestion",
    pollCategory: req.params.category,
  });
  try {
    res.status(201).json(singleQuestionPollsByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all multiple question voting polls
router.get("/multipleQPolls", async (req, res) => {
  const allMultipleQuestionPolls = await votingPoll.find({
    pollType: "multipleQuestion",
  });
  try {
    res.status(201).json(allMultipleQuestionPolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get all multiple question voting polls by category
router.get("/multipleQPollsByCat/:category", async (req, res) => {
  const multipleQuestionPollsByCategory = await votingPoll.find({
    pollType: "multipleQuestion",
    pollCategory: req.params.category,
  });
  try {
    res.status(201).json(multipleQuestionPollsByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get all voting polls by poll poster User Id
router.get("/pollsByUserId/:userId", async (req, res) => {
  const pollsByUserId = await votingPoll.find({
    pollPosterUserId: req.params.userId,
  });
  try {
    res.status(201).json(pollsByUserId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get voting poll by poll Id
router.get("/findSinglePoll/:pollId", async (req, res) => {
  const pollFromPollId = await VotingPoll.find({
    pollId: req.params.pollId,
  });
  try {
    res.status(201).json(pollFromPollId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a new voting poll
router.post("/createNewVotingPoll", async (req, res) => {
  const newVotingPoll = await new VotingPoll({
    pollId: req.body.pollId,
    pollPosterUserId: req.body.pollPosterUserId,
    pollPosterUserUsername: req.body.pollPosterUserUsername,
    pollTitle: req.body.pollTitle,
    pollCategory: req.body.pollCategory,
    pollType: req.body.pollType,
    requiredPollAnswersToEnd: req.body.requiredPollAnswersToEnd,
    singleQuestionPollQuestion: req.body.singleQuestionPollQuestion,
    singleQuestionPollAnswerChoices: req.body.singleQuestionPollAnswerChoices,
    multipleQuestionPollQuestions: req.body.multipleQuestionPollQuestions,
    multipleQuestionPollAnswerChoices:
      req.body.multipleQuestionPollAnswerChoices,
  });
  try {
    res.status(201).json(newVotingPoll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a voting poll
router.delete("/removeVotingPollByPollId/:pollId", async (req, res) => {
  const pollFromPollId = await VotingPoll.find({
    pollId: req.params.pollId,
  });
  try {
    await pollFromPollId.remove();
    res.status(201).json("Poll removed");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/getAllMessagesWithItemId/:itemId", async (req, res) => {
//   const messages = await Message.find({ itemId: req.params.itemId });
//   try {
//     if (messages) {
//       res.status(201).json(messages);
//     } else {
//       res.status(404).json("No messages yet.");
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.get(
//   "/getPreviousMessages/:senderUserId/:recieverUserId/:itemId",
//   async (req, res) => {
//     const messages = await Message.find({
//       senderUserId: req.params.senderUserId,
//       recieverUserId: req.params.recieverUserId,
//       itemId: req.params.itemId,
//     });
//     try {
//       if (messages) {
//         return res.status(201).json(messages);
//       } else {
//         return console.log("could not get messages");
//       }
//     } catch (error) {
//       return res.status(500).json({ message: error.message });
//     }
//   }
// );

// router.post(
//   "/sendNewMessage/:senderUserId/:recieverUserId/:senderUsername",
//   async (req, res) => {
//     const message = await new Message({
//       senderUserId: req.params.senderUserId,
//       recieverUserId: req.params.recieverUserId,
//       itemId: req.body.itemId,
//       messageBody: req.body.messageBody,
//       messageId: req.body.messageId,
//       senderUsername: req.params.senderUsername,
//     });
//     try {
//       const newMessage = message.save();
//       res.status(201).json(newMessage);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );

module.exports = router;
