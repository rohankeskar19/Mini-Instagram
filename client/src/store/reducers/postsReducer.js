const initialState = {
  creatingPost: false,
  feed: [],
  createdPost: false,
  feedUpdated: false,
  postDetails: {},
  commentsLoading: false,
  addingComment: false
};

const postsReducer = (state = initialState, action) => {
  const { postDetails } = state;
  switch (action.type) {
    case "CREATING_POST":
      return {
        ...state,
        creatingPost: true,
        createdPost: false
      };
    case "ADD_POST":
      return {
        ...state,
        feed: state.feed.concat(action.payload)
      };
    case "FETCH_FEED":
      return {
        ...state,
        feed: action.payload
      };
    case "CREATED_POST":
      return {
        ...state,
        creatingPost: false,
        createdPost: true
      };
    case "UPDATE_FEED":
      return {
        ...state,
        feed: action.payload,
        feedUpdated: true
      };
    case "GET_POST_DATA":
      return {
        ...state,
        postDetails: action.payload
      };
    case "RESET_FEED_UPDATED":
      return {
        ...state,
        feedUpdated: false
      };
    case "RESET_CREATED_POST":
      return {
        ...state,
        createdPost: false
      };
    case "ADDING_COMMENT":
      return {
        ...state,
        addingComment: true
      };
    case "LIKED_POST":
      postDetails.liked = true;
      postDetails.likes += 1;
      return {
        ...state,
        postDetails: {
          ...postDetails
        }
      };
    case "UPDATING_COMMENTS":
      return {
        ...state,
        commentsLoading: true
      };
    case "UNLIKED_POST":
      postDetails.liked = false;
      postDetails.likes -= 1;

      return {
        ...state,
        postDetails: {
          ...postDetails
        }
      };

    case "ADD_COMMENT":
      if (postDetails.id === action.payload.postId) {
        const { comments } = postDetails;
        comments.unshift(action.payload.comment);

        postDetails.comments = comments;

        return {
          ...state,
          postDetails: {
            ...postDetails
          },
          addingComment: false
        };
      } else {
        return state;
      }

    case "REFRESH_COMMENTS":
      if (postDetails.id === action.payload.postId) {
        postDetails.comments = action.payload.comments;

        return {
          ...state,
          postDetails: {
            ...postDetails
          },
          commentsLoading: false
        };
      } else {
        return state;
      }
    case "CLEAR_POST_DATA":
      return initialState;
    default:
      return state;
  }
};

export default postsReducer;
