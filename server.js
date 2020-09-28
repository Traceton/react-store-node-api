require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const inventoryItemsRouter = require("./routes/inventoryItems");
const usersRouter = require("./routes/users");

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
server.use(express.json());
server.use("/inventoryItems", inventoryItemsRouter);
server.use("/users", usersRouter);

server.listen(process.env.PORT, () => {
  console.log(
    ` react store server running on http://localhost:${process.env.PORT}`
  );
});
