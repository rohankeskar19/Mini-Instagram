const express = require("express");
const mongoose = require("mongoose");

// Config file
const config = require("./config/keys");

// Mongodb connected
mongoose.connect(config.mongoDBUri, { useNewUrlParser: true }, () => {
  console.log("Connected to mongo db");
});

const app = express();

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const user = require("./routes/user");
const post = require("./routes/post");

// PORT
const port = 3000 | process.env.PORT;

app.use("/api/user/*", user);
app.use("/api/post/*", post);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
