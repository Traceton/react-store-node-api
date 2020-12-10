const express = require("express");
const mongoose = require("mongoose");
const router = express();
const SocietyUser = require("../models/societyUser");

// @route get /
// @desc loads form
router.get("/", async (req, res) => {
  const user = await SocietyUser.find();
  try {
    res.status(201).json(user);
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
