const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
    default: "none",
  },
  lastName: {
    type: String,
    required: false,
    default: "none",
  },
  email: {
    type: String,
    required: false,
    default: "none",
  },
  phone: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // updated below
  streetAddress: {
    type: String,
    required: false,
    default: "none",
  },
  city: {
    type: String,
    required: false,
    default: "none",
  },
  state: {
    type: String,
    required: false,
    default: "none",
  },
  zipCode: {
    type: String,
    required: false,
    default: "none",
  },
  storeListings: {
    type: Number,
    required: false,
    default: 0,
  },
  messageInbox: {
    type: String,
    required: false,
    default: "none",
  },
  profilePreferences: {
    type: String,
    required: false,
    default: "none",
  },
  userBio: {
    type: String,
    required: false,
    default: "none",
  },
});

module.exports = mongoose.model("user", userSchema);
