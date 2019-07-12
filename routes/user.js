const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const config = require("../config/keys");

const User = require("../models/User");

const validator = require("../validators/user");

// @route - /api/user/register
// @method - POST
// @access - Public
// @params - email,username,profileUrl,bio,password,password2
Router.post("/register", (req, res) => {
  const { email, username, profileUrl, bio, password, password2 } = req.body;

  const errors = validator.validateRegisterData(
    email,
    username,
    profileUrl,
    bio,
    password,
    password2
  );

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  } else {
    User.find({ email: email }, (err, data) => {
      if (!err) {
        if (data) {
          if (data.length) {
            return res.status(409).json({ error: "Email id already used" });
          } else {
            User.find({ username: username }, (err, data) => {
              if (!err) {
                if (data) {
                  if (data.length) {
                    return res
                      .status(409)
                      .json({ error: "Username already used" });
                  } else {
                    bcrypt.hash(password, config.saltRounds, (err, hash) => {
                      if (!err) {
                        const user = new User({
                          email,
                          username,
                          profileUrl,
                          bio,
                          password: hash
                        });

                        user.save((err, user) => {
                          if (!err) {
                            if (user) {
                              const newUser = {
                                email: user.email,
                                username: user.username,
                                profileUrl: user.profileUrl,
                                bio: user.bio,
                                createdAt: user.createdAt
                              };
                              return res.json(newUser);
                            } else {
                              return res.status(500).json({
                                error: "Failed to register account (try again)"
                              });
                            }
                          } else {
                            return res.status(500).json({
                              error: "Failed to register account (try again)"
                            });
                          }
                        });
                      } else {
                        return res.status(500).json({
                          error: "Failed to process request (try again)"
                        });
                      }
                    });
                  }
                } else {
                  return res
                    .status(500)
                    .json({ error: "Failed to process request (try again)" });
                }
              } else {
                return res
                  .status(500)
                  .json({ error: "Failed to process request (try again)" });
              }
            });
          }
        } else {
          return res
            .status(500)
            .json({ error: "Failed to process request (try again)" });
        }
      } else {
        return res
          .status(500)
          .json({ error: "Failed to process request (try again)" });
      }
    });
  }
});

// @route - /api/user/login
// @method - POST
// @access - Public
// @params - email or username,password
Router.post("/login", (req, res) => {
  const { email, username, password } = req.body;

  if (email) {
    const errors = validator.validateLoginData(email, password, 0);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json(errors);
    } else {
      User.find({ email: email }, (err, data) => {
        if (!err) {
          if (data) {
            if (data.length) {
              bcrypt.compare(password, data[0].password, (err, match) => {
                if (!err) {
                  if (match) {
                    const newUser = {
                      email: data[0].email,
                      username: data[0].username,
                      profileUrl: data[0].profileUrl,
                      bio: data[0].bio,
                      createdAt: data[0].createdAt
                    };
                    jsonwebtoken.sign(
                      newUser,
                      config.secret,
                      {
                        expiresIn: config.tokenDuration
                      },
                      (err, token) => {
                        if (!err) {
                          if (token) {
                            const newToken = "Bearer " + token;
                            return res.json({ auth: true, token: newToken });
                          } else {
                            return res.status(500).json({
                              error: "Failed to process request (try again)1"
                            });
                          }
                        } else {
                          return res.status(500).json({
                            error: "Failed to process request (try again)2"
                          });
                        }
                      }
                    );
                  } else {
                    return res
                      .status(422)
                      .json({ error: "Invalid credentials" });
                  }
                } else {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Failed to process request (try again)3" });
                }
              });
            } else {
              return res.status(404).json({ error: "User does not exists" });
            }
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request (try again)4" });
          }
        } else {
          return res
            .status(500)
            .json({ error: "Failed to process request (try again)5" });
        }
      });
    }
  } else {
    const errors = validator.validateLoginData(email, password, 1);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json(errors);
    } else {
      User.find({ username: username }, (err, data) => {
        if (!err) {
          if (data) {
            if (data.length) {
              bcrypt.compare(password, data[0].password, (err, match) => {
                if (!err) {
                  if (match) {
                    const newUser = {
                      email: data[0].email,
                      username: data[0].username,
                      profileUrl: data[0].profileUrl,
                      bio: data[0].bio,
                      createdAt: data[0].createdAt
                    };
                    jsonwebtoken.sign(
                      newUser,
                      config.secret,
                      {
                        expiresIn: config.tokenDuration
                      },
                      (err, token) => {
                        if (!err) {
                          if (token) {
                            const newToken = "Bearer " + token;
                            return res.json({ auth: true, token: newToken });
                          } else {
                            return res.status(500).json({
                              error: "Failed to process request (try again)1"
                            });
                          }
                        } else {
                          return res.status(500).json({
                            error: "Failed to process request (try again)2"
                          });
                        }
                      }
                    );
                  } else {
                    return res
                      .status(422)
                      .json({ error: "Invalid credentials" });
                  }
                } else {
                  return res
                    .status(500)
                    .json({ error: "Failed to process request (try again)3" });
                }
              });
            } else {
              return res.status(404).json({ error: "User does not exists" });
            }
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request (try again)4" });
          }
        } else {
          return res
            .status(500)
            .json({ error: "Failed to process request (try again)5" });
        }
      });
    }
  }
});

module.exports = Router;
