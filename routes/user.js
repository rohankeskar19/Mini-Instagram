const Router = require("express").Router();
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const config = require("../config/keys");

const User = require("../models/User");
const Notification = require("../models/Notification");
const Post = require("../models/Post");

const validator = require("../validators/user");
const Authentication = require("../middlewares/Authentication");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid mime Type, only JPEG,JPG or PNG"));
  }
};

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accesKey,
  region: "ap-south-1"
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "min-social-media",
    fileFilter: fileFilter,
    acl: "public-read",
    key: (req, file, cb) => {
      const arr = file.originalname.split(".");
      const extension = arr[arr.length - 1];
      cb(null, Date.now().toString() + "." + extension);
    }
  })
});

const singleUpload = upload.single("profile");

// @route - /api/user/profile-upload
// @method - POST
// @access - Public
// @params - profileImage
Router.post("/profile-upload", (req, res) => {
  singleUpload(req, res, err => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Error while uploading the file try again" });
    }
    return res.json({ profileUrl: req.file.location });
  });
});

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
            return res.status(409).json({ email: "Email id already used" });
          } else {
            User.find({ username: username }, (err, data) => {
              if (!err) {
                if (data) {
                  if (data.length) {
                    return res
                      .status(409)
                      .json({ username: "Username already used" });
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
                                id: user._id,
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
  console.log(req.body);
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
                      .json({ loginId: "Invalid credentials" });
                  }
                } else {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Failed to process request (try again)" });
                }
              });
            } else {
              return res.status(404).json({ loginId: "User does not exists" });
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
    const errors = validator.validateLoginData(username, password, 1);
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
                      .json({ loginId: "Invalid credentials" });
                  }
                } else {
                  return res
                    .status(500)
                    .json({ error: "Failed to process request (try again)" });
                }
              });
            } else {
              return res.status(404).json({ loginId: "User does not exists" });
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
  console.log(username + " username");
  if (username) {
    if (username.trim() != "") {
      User.find({ username: { $regex: ".*" + username } })
        .limit(5)
        .exec((err, data) => {
          if (!err) {
            if (data) {
              const usersArray = [];
              data.forEach(user => {
                if (user._id != req.user.id) {
                  const newUser = {
                    id: user._id,
                    username: user.username,
                    profileUrl: user.profileUrl,
                    bio: user.bio
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
  console.log(user_id);
  if (user_id) {
    if (user_id.trim() != "") {
      if (req.user.id == user_id) {
        return res.status(422).json({ error: "Invalid data" });
      }
      User.findById(req.user.id, (err, userData) => {
        if (!err) {
          if (userData) {
            const { following } = userData;

            var matchFound = false;
            following.forEach(id => {
              if (id == user_id) {
                matchFound = true;
              }
            });

            if (matchFound) {
              return res
                .status(422)
                .json({ error: "You are already following this user" });
            }

            following.push(user_id);

            userData.following = following;

            userData.save((err, data) => {
              if (!err) {
                User.findById(user_id, (err, userData2) => {
                  if (!err) {
                    if (userData2) {
                      const { followers } = userData2;
                      var matchFound = false;
                      followers.forEach(id => {
                        if (id == req.user.id) {
                          matchFound = true;
                        }
                      });

                      if (matchFound) {
                        return res.status(422).json({
                          error: "You are already following this user"
                        });
                      }

                      followers.push(req.user.id);

                      userData2.followers = followers;

                      userData2.save((err, user) => {
                        if (!err) {
                          if (user) {
                            const notification = new Notification({
                              user_id: user._id,
                              profileUrl: userData.profileUrl,
                              title: `${
                                userData.username
                              } started following you`,
                              username: userData.username
                            });
                            notification.save((err, notification) => {
                              if (!err) {
                                if (notification) {
                                  return res.json({ user_id: user_id });
                                } else {
                                  return res.status(500).json({
                                    error:
                                      "Failed to process request (try again)"
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
                      });
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
                });
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
      });
    } else {
      console.log("ola1");
      return res.status(422).json({ error: "Invalid data" });
    }
  } else {
    console.log("ola2");
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
      User.findById(req.user.id, (err, userData) => {
        if (!err) {
          if (userData) {
            const { following } = userData;
            var followsUser = false;

            following.forEach(id => {
              if (id == user_id) {
                followsUser = true;
              }
            });

            if (!followsUser) {
              return res.status(422).json({ error: "Invalid request" });
            }

            var index = following.indexOf(user_id);

            following.splice(index, 1);

            userData.following = following;

            userData.save((err, data) => {
              if (!err) {
                if (data) {
                  User.findById(user_id, (err, userData2) => {
                    const { followers } = userData2;
                    var followedBy = false;
                    followers.forEach(id => {
                      if (id == req.user.id) {
                        followedBy = true;
                      }
                    });

                    if (!followedBy) {
                      return res.status(422).json({ error: "Invalid request" });
                    }

                    var index = followers.indexOf(req.user.id);

                    followers.splice(index, 1);

                    userData2.followers = followers;

                    userData2.save((err, user) => {
                      if (!err) {
                        if (user) {
                          return res.json({ user_id: user_id });
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

// @route - /api/user/details/:username
// @method - GET
// @access - Public
// @params - username
Router.get("/details/:username", (req, res) => {
  const { username } = req.params;
  console.log(username);
  if (username) {
    if (username.trim() != "") {
      User.findOne({ username: username }, (err, userData) => {
        if (!err) {
          if (userData) {
            Post.find({ username: username }, (err, postsData) => {
              if (!err) {
                if (postsData) {
                  console.log(postsData.length);
                  const posts = [];
                  if (postsData.length > 0) {
                    postsData.forEach(post => {
                      newPost = {
                        id: post._id,
                        imageUrl: post.imageUrl,
                        user_id: post.user_id,
                        username: post.username,
                        createdAt: post.createdAt,
                        likes_count: post.likes,
                        comments_count: post.comments.length
                      };
                      posts.push(newPost);
                    });
                  }

                  const response = {
                    user_id: userData._id,
                    followers_count: userData.followers.length,
                    following_count: userData.following.length,
                    followers: userData.followers,
                    following: userData.following,
                    profileUrl: userData.profileUrl,
                    posts: posts,
                    posts_count: posts.length,
                    username: userData.username,
                    bio: userData.bio,
                    likedPosts: userData.likedPosts
                  };
                  return res.json({ user: response });
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

// @route - /api/user/notifications
// @method - GET
// @access - Private
// @params - user_id
Router.get("/notifications", Authentication.isAuthenticated, (req, res) => {
  var responseSent = false;
  Notification.find({ user_id: req.user.id })
    .sort({ createdAt: "desc" })
    .exec((err, data) => {
      if (!err) {
        if (data) {
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              Notification.findByIdAndUpdate(
                data[i]._id,
                { retrieved: true },
                (err, notification) => {
                  if (!err) {
                    if (notification) {
                      if (i == data.length && !responseSent) {
                        responseSent = true;
                        return res.json(data);
                      }
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
            }
          } else {
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
    });
});

// @route - /api/user/feed
// @method - GET
// @access - Private
// @params - user_id
Router.get("/feed", Authentication.isAuthenticated, (req, res) => {
  const userId = req.user.id;
  var responseSent = false;
  var postsArray = [];
  Post.find({ user_id: req.user.id })
    .sort({ createdAt: -1 })
    .exec((err, data) => {
      if (!err) {
        if (data) {
          if (data.length > 0) {
            data.forEach(post => {
              postsArray.push(post);
            });
          }
          User.findById(userId, (err, userData) => {
            if (!err) {
              if (userData) {
                const following = userData.following;
                if (following.length > 0) {
                  for (var i = 0; i < following.length; i++) {
                    Post.find({ user_id: following[i] })
                      .sort({ createdAt: -1 })
                      .exec((err, data) => {
                        if (!err) {
                          if (data) {
                            if (data.length > 0) {
                              data.forEach(post => {
                                postsArray.push(post);
                              });
                            }
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
                        if (i == following.length && !responseSent) {
                          responseSent = true;

                          return res.json({ feed: postsArray });
                        }
                      });
                  }
                } else {
                  return res.json({ feed: postsArray });
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

// @route - /api/user/post-details
// @method - GET
// @access - Public
// @params - postId
Router.get("/post-details", (req, res) => {
  const { postId } = req.body;

  if (postId) {
    Post.findById(postId, (err, postData) => {
      if (!err) {
        if (data) {
          const { user_id } = data;

          User.findById(user_id, (err, userData) => {
            if (!err) {
              if (userData) {
                const responseData = {
                  profileUrl: userData.profileUrl,
                  username: userData.username,
                  user_id: userData._id,
                  postId: postData._id,
                  imageUrl: postData.imageUrl,
                  caption: postData.caption,
                  comments: postData.comments
                };
                return res.json(responseData);
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
        }
      } else {
        return res
          .status(500)
          .json({ error: "Failed to process request (try again)" });
      }
    });
  } else {
    return res.status(422).json({ error: "Invalid request" });
  }
});

module.exports = Router;
