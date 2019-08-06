const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Config file
const config = require("./config/keys");

// Mongodb connected
mongoose.connect(
  config.mongoDBUri,
  { useNewUrlParser: true, useFindAndModify: false },
  () => {
    console.log("Connected to mongo db");
  }
);

const app = express();

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const user = require("./routes/user");
const post = require("./routes/post");

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// PORT
const port = process.env.PORT || 5000;

app.use("/api/user/", user);
app.use("/api/post/", post);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
