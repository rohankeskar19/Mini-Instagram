import Axios from "axios";
import moment from "moment";
import store from "../store";
export const createPost = postData => {
  return (dispatch, getState) => {
    dispatch({ type: "CREATING_POST" });

    Axios.post("/api/post/new", {
      imageUrl: postData.imageUrl,
      caption: postData.caption
    })
      .then(res => {
        dispatch({ type: "CREATED_POST" });

        dispatch({ type: "ADD_POST", payload: res.data.post });
      })
      .catch(err => {});
  };
};

export const fetchFeed = () => {
  return (dispatch, getState) => {
    Axios.get("/api/user/feed")
      .then(res => {
        var feed = res.data.feed;
        const state = store.getState();
        const likedPosts = state.user.userData.likedPosts;

        for (var i = 0; i < feed.length; i++) {
          for (var j = 0; j < feed.length - i - 1; j++) {
            if (moment(feed[j + 1].createdAt).isAfter(feed[j].createdAt)) {
              var temp = feed[j];
              feed[j] = feed[j + 1];
              feed[j + 1] = temp;
            }
          }
        }

        for (var i = 0; i < feed.length; i++) {
          if (likedPosts.indexOf(feed[i]._id) > -1) {
            feed[i]["liked"] = true;
          } else {
            feed[i]["liked"] = false;
          }
        }

        dispatch({ type: "FETCH_FEED", payload: feed });
      })
      .catch(err => {});
  };
};

export const likePost = postId => {
  return (dispatch, getState) => {
    Axios.put("/api/post/like", { postId: postId })
      .then(res => {
        const feed = store.getState().posts.feed;

        feed.forEach(post => {
          if (post._id === postId) {
            post.liked = true;
          }
        });

        dispatch({ type: "UPDATE_FEED", payload: feed });
        dispatch({ type: "LIKED_POST", payload: res.data.postId });
      })
      .catch(err => {});
  };
};

export const unlikePost = postId => {
  return (dispatch, getState) => {
    Axios.put("/api/post/unlike", { postId: postId })
      .then(res => {
        const feed = store.getState().posts.feed;

        feed.forEach(post => {
          if (post._id === postId) {
            post.liked = false;
          }
        });

        dispatch({ type: "UPDATE_FEED", payload: feed });
        dispatch({ type: "UNLIKED_POST", payload: res.data.postId });
      })
      .catch(err => {});
  };
};

export const getPostData = postId => {
  return (dispatch, getState) => {
    Axios.get(`/api/post/${postId}`)
      .then(res => {
        const likedPosts = store.getState().user.userData.likedPosts;

        if (likedPosts.indexOf(postId) > -1) {
          res.data.post["liked"] = true;
        } else {
          res.data.post["liked"] = false;
        }

        dispatch({ type: "GET_POST_DATA", payload: res.data.post });
      })
      .catch(err => {});
  };
};

export const addComment = (postId, comment) => {
  return (dispatch, getState) => {
    Axios.post("/api/post/comment", {
      postId: postId,
      comment_content: comment
    })
      .then(res => {
        dispatch({
          type: "ADD_COMMENT",
          payload: {
            postId: postId,
            comment: res.data
          }
        });
      })
      .catch(err => {});
  };
};

export const refreshComments = postId => {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATING_COMMENTS" });
    Axios.get(`/api/post/comments/${postId}`)
      .then(res => {
        dispatch({
          type: "REFRESH_COMMENTS",
          payload: {
            postId: postId,
            comments: res.data.reverse()
          }
        });
      })
      .catch(err => {});
  };
};

export const resetFeedUpdated = () => {
  return (dispatch, getState) => {
    dispatch({ type: "RESET_FEED_UPDATED" });
  };
};

export const resetCreatedPost = () => {
  return (dispatch, getState) => {
    dispatch({ type: "RESET_CREATED_POST" });
  };
};
