const initialState = {
  creatingPost: false,
  feed: [],
  createdPost: false
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATING_POST":
      return {
        ...state,
        creatingPost: true,
        createdPost: false
      };
    case "ADD_POST":
      console.log(action.payload);
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
    default:
      return state;
  }
};

export default postsReducer;
