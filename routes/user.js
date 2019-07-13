const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const config = require("../config/keys");

const User = require("../models/User");
const Notification = require("../models/Notification");
const Post = require("../models/Post");

const validator = require("../validators/user");
const Authentication = require("../middlewares/Authentication");

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
                      id: data[0]._id,
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
                              error: "Failed to process request (try again)"
                            });
                          }
                        } else {
                          return res.status(500).json({
                            error: "Failed to process request (try again)"
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
                    .json({ error: "Failed to process request (try again)" });
                }
              });
            } else {
              return res.status(404).json({ error: "User does not exists" });
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
                      id: data[0]._id,
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
                              error: "Failed to process request (try again)"
                            });
                          }
                        } else {
                          return res.status(500).json({
                            error: "Failed to process request (try again)"
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
                    .json({ error: "Failed to process request (try again)" });
                }
              });
            } else {
              return res.status(404).json({ error: "User does not exists" });
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
  }
});

// @route - /api/user/users
// @method - POST
// @access - Private
// @params - username
Router.post("/users", Authentication.isAuthenticated, (req, res) => {
  const { username } = req.body;

  if (username) {
    if (username.trim() != "") {
      User.find({ username: { $regex: ".*" + username } }, (err, data) => {
        if (!err) {
          if (data) {
            const usersArray = [];
            data.forEach(user => {
              if (user._id != req.user.id) {
                const newUser = {
                  id: user._id,
                  username: user.username,
                  profileUrl: user.profileUrl
                };
                usersArray.push(newUser);
              }
            });
            return res.json({ users: usersArray });
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
    } else {
      return res.status(422).json({ error: "Invalid data" });
    }
  } else {
    return res.status(422).json({ error: "Invalid data" });
  }
});

// @route - /api/user/follow
// @method - PUT
// @access - Private
// @params - user_id
Router.put("/follow", Authentication.isAuthenticated, (req, res) => {
  const { user_id } = req.body;

  if (user_id) {
    if (user_id.trim() != "") {
      if (req.user.id == user_id) {
        return res.status(422).json({ error: "Invalid data" });
      }
      User.findByIdAndUpdate(
        req.user.id,
        { $push: { following: user_id } },
        (err, userData) => {
          if (!err) {
            if (userData) {
              User.findByIdAndUpdate(
                user_id,
                { $push: { followers: req.user.id } },
                (err, data) => {
                  if (!err) {
                    if (data) {
                      const notification = new Notification({
                        user_id: data._id,
                        profileUrl: userData.profileUrl,
                        title: `${userData.username} started following you`
                      });

                      notification.save((err, data) => {
                        if (!err) {
                          if (data) {
                            return res.json({ message: "success" });
                          } else {
                            return res.status(500).json({
                              error: "Failed to process request (try again)"
                            });
                          }
                        } else {
                          return res.status(500).json({
                            error: "Failed to process request (try again)"
                          });
                        }
                      });
                    } else {
                      return res.status(500).json({
                        error: "Failed to process request (try again)"
                      });
                    }
                  } else {
                    return res.status(500).json({
                      error: "Failed to process request (try again)"
                    });
                  }
                }
              );
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
        }
      );
    } else {
      return res.status(422).json({ error: "Invalid data" });
    }
  } else {
    return res.status(422).json({ error: "Invalid data" });
  }
});

// @route - /api/user/unfollow
// @method - PUT
// @access - Private
// @params - user_id
Router.put("/unfollow", Authentication.isAuthenticated, (req, res) => {
  const { user_id } = req.body;

  if (user_id) {
    if (user_id.trim() != "") {
      if (req.user.id == user_id) {
        return res.status(422).json({ error: "Invalid data" });
      }
      User.findByIdAndUpdate(
        req.user.id,
        { $pull: { following: user_id } },
        (err, data) => {
          if (!err) {
            if (data) {
              User.findByIdAndUpdate(
                user_id,
                { $pull: { followers: req.user.id } },
                (err, data) => {
                  if (!err) {
                    if (data) {
                      return res.json({ message: "success" });
                    } else {
                      return res.status(500).json({
                        error: "Failed to process request (try again)"
                      });
                    }
                  } else {
                    return res
                      .status(500)
                      .json({ error: "Failed to process request (try again)" });
                  }
                }
              );
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
        }
      );
    } else {
      return res.status(422).json({ error: "Invalid data" });
    }
  } else {
    return res.status(422).json({ error: "Invalid data" });
  }
});

// @route - /api/user/details
// @method - GET
// @access - Public
// @params - user_id
Router.get("/details", (req, res) => {
  const { username } = req.body;

  if (username) {
    if (username.trim() != "") {
      User.find({ username: username }, (err, userData) => {
        if (!err) {
          if (userData) {
            Post.find({ username: username }, (err, postsData) => {
              if (!err) {
                if (postsData) {
                  const posts = [];

                  postsData.forEach(post => {
                    newPost = {
                      imageUrl: post.imageUrl,
                      createdAt: post.createdAt
                    };
                    posts.push(newPost);
                  });

                  const response = {
                    followers_count: userData.followers.length,
                    following_count: userData.following.length,
                    profileUrl: userData.profileUrl,
                    posts: posts,
                    posts_count: posts.length,
                    username: userData.username,
                    bio: userData.bio
                  };
                  return res.json({ data: response });
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
    } else {
      return res
        .status(500)
        .json({ error: "Failed to process request (try again)" });
    }
  } else {
    return res.status(422).json({ error: "Invalid data" });
  }
});

// @route - /api/user/followers
// @method - GET
// @access - Public
// @params - user_id
Router.get("/followers", (req, res) => {
  const { user_id } = req.body;

  User.findById(user_id, (err, data) => {
    if (!err) {
      if (data) {
        const { followers } = data;

        User.find({ _id: { $in: followers } }, (err, data) => {
          if (!err) {
            if (data) {
              if (data.length) {
                const response = [];
                data.forEach(user => {
                  const userResponse = {
                    username: user.username,
                    profileUrl: user.profileUrl,
                    id: user._id
                  };
                  response.push(userResponse);
                });
                return res.json(response);
              } else {
                return res.json(data);
              }
            } else {
            }
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request (try again)" });
          }
        });
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
});

// @route - /api/user/following
// @method - GET
// @access - Public
// @params - user_id
Router.get("/following", (req, res) => {
  const { user_id } = req.body;

  User.findById(user_id, (err, data) => {
    if (!err) {
      if (data) {
        const { following } = data;

        User.find({ _id: { $in: following } }, (err, data) => {
          if (!err) {
            if (data) {
              if (data.length) {
                const response = [];
                data.forEach(user => {
                  const userResponse = {
                    username: user.username,
                    profileUrl: user.profileUrl,
                    id: user._id
                  };
                  response.push(userResponse);
                });
                return res.json(response);
              } else {
                return res.json(data);
              }
            } else {
            }
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request (try again)" });
          }
        });
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
});

// @route - /api/user/notifications
// @method - GET
// @access - Private
// @params - user_id
Router.get("/notifications", Authentication.isAuthenticated, (req, res) => {
  Notification.find({ user_id: req.user.id }, (err, data) => {
    if (!err) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          Notification.findByIdAndUpdate(
            notification[i]._id,
            { retrieved: true },
            (err, data) => {
              if (!err) {
                if (data) {
                  if (i == data.length) {
                    return res.json(data);
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
            }
          );
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
});

module.exports = Router;
