require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const inventoryItemsRouter = require("./routes/inventoryItems");
const mongoose = require("mongoose");

server.use(cors());
server.use(express.json());
server.use("/inventoryItems", inventoryItemsRouter);

server.listen(process.env.PORT, () => {
  console.log(
    ` react store server running on http://localhost:${process.env.PORT}`
  );
});
