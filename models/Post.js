const mongoose = require("mongoose");

const post = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  imageurl: {
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
  }
});

module.exports = mongoose.model("Post", post);
