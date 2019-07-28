const Router = require("express").Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

const config = require("../config/keys");

const Authentication = require("../middlewares/Authentication");
const validator = require("../validators/post");

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

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

const singleUpload = upload.single("post");

// @route - /api/post/image-upload
// @method - POST
// @access - Private
// @params - profileImage
Router.post("/image-upload", Authentication.isAuthenticated, (req, res) => {
  singleUpload(req, res, err => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Error while uploading the file try again" });
    }
    return res.json({ postImageUrl: req.file.location });
  });
});

// @route - /api/post/new
// @method - POST
// @access - Private
// @params - user_id,imageUrl
Router.post("/new", Authentication.isAuthenticated, (req, res) => {
  const { imageUrl, caption } = req.body;
  var responseSent = false;
  console.log(req.body);
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
                username: userData.username,
                imageUrl: imageUrl,
                caption: caption
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
                    if (followers.length > 0) {
                      console.log("olaaa");
                      console.log(followers);
                      for (var i = 0; i < followers.length; i++) {
                        const notification = new Notification({
                          user_id: followers[i],
                          profileUrl: userData.profileUrl,
                          postImageUrl: imageUrl,
                          title: `${userData.username} created a post`,
                          username: userData.username
                        });
                        notification.save((err, data) => {
                          if (!err) {
                            if (data) {
                              if (i == followers.length && !responseSent) {
                                responseSent = true;
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
                      return res.json({ post: response });
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
                        postImageUrl: postData.imageUrl,
                        title: `${userData.username} liked your post`,
                        username: userData.username,
                        postId: postData._id
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
