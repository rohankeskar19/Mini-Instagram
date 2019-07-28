const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  id: {
    type: String
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
  postImageUrl: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  postId: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notification);
