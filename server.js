require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");

const inventoryItemsRouter = require("./routes/inventoryItems");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");
const votingPollsRouter = require("./routes/votingPolls");
const societyUsersRouter = require("./routes/societyUsers");
const WorkplaceSurveyRouter = require("./routes/workplaceSurveys");

const mongoose = require("mongoose");

const database = mongoose.connection;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
database.on("error", (error) => {
  console.log(error);
});
database.once("open", () => {
  console.log("connected to database");
});

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/inventoryItems", inventoryItemsRouter);
server.use("/users", usersRouter);
server.use("/messages", messagesRouter);
server.use("/votingPolls", votingPollsRouter);
server.use("/societyUsers", societyUsersRouter);
server.use("/workplaceSurveys", WorkplaceSurveyRouter);

server.listen(process.env.PORT, () => {
  console.log(
    ` react store server running on http://localhost:${process.env.PORT}`
  );
});
