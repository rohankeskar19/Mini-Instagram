const Router = require("express").Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

const Authentication = require("../middlewares/Authentication");
const validator = require("../validators/post");

// @route - /api/post/new
// @method - POST
// @access - Private
// @params - user_id,imageUrl
Router.post("/new", Authentication.isAuthenticated, (req, res) => {
  const { imageUrl, caption } = req.body;

  if (imageUrl && caption) {
    if (imageUrl.trim() != "" && caption) {
      const errors = validator.validatePostData(imageUrl, caption);
      if (Object.keys(errors).length > 0) {
        return res.status(422).json({ error: "Invalid data" });
      } else {
        User.findById(req.user.id, (err, userData) => {
          if (!err) {
            if (userData) {
              const post = new Post({
                user_id: userData._id,
                imageUrl: imageUrl
              });
              post.save((err, postData) => {
                if (!err) {
                  if (postData) {
                    const response = {
                      id: postData._id,
                      imageUrl: postData.imageUrl,
                      caption: postData.caption,
                      user_id: postData.user_id,
                      comments: postData.comments,
                      likes: postData.likes,
                      createdAt: postData.createdAt,
                      username: userData.username,
                      profileUrl: userData.profileUrl
                    };
                    const { followers } = userData;
                    for (var i = 0; i < followers.length; i++) {
                      const notification = new Notification({
                        user_id: followers[i],
                        profileUrl: userData.profileUrl,
                        thumbnailUrl: imageUrl,
                        title: `${userData.username} created a post`
                      });
                      notification.save((err, data) => {
                        if (!err) {
                          if (data) {
                            if (i == followers.length) {
                              return res.json({ post: response });
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
            } else {
              return res.status(422).json({ error: "Invalid request" });
            }
          } else {
            return res
              .status(500)
              .json({ error: "Failed to process request (try again)" });
          }
        });
      }
    }
  } else {
    return res.status(422).json({ error: "Invalid request" });
  }
});

// @route - /api/post/postdata
// @method - GET
// @access - Public
// @params - postId
Router.get("/postdata", (req, res) => {
  const { postId } = req.body;

  if (postId) {
    if (postId.trim() != "") {
      Post.findById(postId, (err, postData) => {
        if (!err) {
          if (postData) {
            User.findById(postData.user_id, (err, userData) => {
              if (!err) {
                if (userData) {
                  const { comments } = postData;
                  const commentsToSend = [];

                  for (var i = 0; i < comments.length; i++) {
                    User.findById(comments[i].user_id, (err, data) => {
                      if (!err) {
                        if (data) {
                          const newComment = {
                            user_id: data._id,
                            username: data.username,
                            profileUrl: data.profileUrl,
                            createdAt: comments[i].createdAt,
                            id: comments[i]._id,
                            content: comments[i].content
                          };
                          commentsToSend.push(newComment);
                          if (i == comments.length) {
                            const response = {
                              id: postData._id,
                              imageUrl: postData.imageUrl,
                              caption: postData.caption,
                              user_id: postData.user_id,
                              comments: commentsToSend,
                              likes: postData.likes,
                              createdAt: postData.createdAt,
                              username: userData.username,
                              profileUrl: userData.profileUrl
                            };
                            return res.json({ post: response });
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
      return res.status(422).json({ error: "Invalid request" });
    }
  } else {
    return res.status(422).json({ error: "Invalid request" });
  }
});

// @route - /api/post/like
// @method - PUT
// @access - Private
// @params - postId,user_id
Router.put("/like", Authentication.isAuthenticated, (req, res) => {
  const { postId } = req.body;

  if (postId) {
    if (postId.trim() != "") {
      Post.findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 } },
        (err, postData) => {
          if (!err) {
            if (postData) {
              User.findByIdAndUpdate(
                req.user.id,
                { $push: { likedPosts: postId } },
                (err, userData) => {
                  if (!err) {
                    if (userData) {
                      const notification = new Notification({
                        id: postData._id,
                        user_id: postData.user_id,
                        profileUrl: userData.profileUrl,
                        thumbnailUrl: postData.imageUrl,
                        title: `${userData.username} liked your post`
                      });
                      notification.save((err, data) => {
                        if (!err) {
                          if (data) {
                            return res.json({ postId: postId });
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
      return res.status(422).json({ error: "Invalid request" });
    }
  } else {
    return res.status(422).json({ error: "Invalid request" });
  }
});

// @route - /api/post/unlike
// @method - PUT
// @access - Private
// @params - postId,user_id
Router.put("/unlike", Authentication.isAuthenticated, (req, res) => {
  const { postId } = req.body;

  if (postId) {
    if (postId.trim() != "") {
      Post.findByIdAndUpdate(postId, { $dec: { likes: -1 } }, (err, data) => {
        if (!err) {
          if (data) {
            User.findByIdAndUpdate(
              req.user.id,
              { $pull: { likedPosts: postId } },
              (err, data) => {
                if (!err) {
                  if (data) {
                    return res.json({ postId: postId });
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
      return res.status(422).json({ error: "Invalid request" });
    }
  } else {
    return res.status(422).json({ error: "Invalid request" });
  }
});

// @route - /api/post/comment
// @method - POST
// @access - Private
// @params - postId,comment_content
Router.post("/comment", Authentication.isAuthenticated, (req, res) => {
  const { postId, comment_content } = req.body;

  if (postId && comment_content) {
    if (postId.trim() != "" && comment_content.trim() != "") {
      const comment = {
        user_id: req.user.id,
        content: comment_content
      };
      Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        (err, data) => {
          if (!err) {
            if (data) {
              return res.json(data);
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
    return res.status(422).json({ error: "Invalid request" });
  }
});

module.exports = Router;
