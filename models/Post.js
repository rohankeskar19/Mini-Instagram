const mongoose = require("mongoose");

const post = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  comments: [
    {
      username: {
        type: String
      },
      content: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: {
        type: Number
      }
    }
  ],
  likes: {
    type: Number
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", post);
