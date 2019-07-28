import Axios from "axios";

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
      .catch(err => {
        console.log(err);
      });
  };
};

export const fetchFeed = () => {
  return (dispatch, getState) => {
    Axios.get("/api/user/feed")
      .then(res => {
        dispatch({ type: "FETCH_FEED", payload: res.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
