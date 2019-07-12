const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [
    {
      user_id: {
        type: String,
        required: true
      }
    }
  ],
  following: [
    {
      user_id: {
        type: String,
        required: true
      }
    }
  ],
  posts: [
    {
      postId: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model("User", user);
