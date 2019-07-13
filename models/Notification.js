const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  retrieved: {
    type: Boolean,
    required: true,
    default: false
  },
  profileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notification);
