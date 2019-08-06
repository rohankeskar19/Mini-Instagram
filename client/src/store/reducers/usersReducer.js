const initialState = {
  userData: {},
  userDetails: {},
  users: [],
  notifications: [],
  notificationsLoading: false,
  notificationsLength: 0,
  followingUser: false,
  unfollowingUser: false
};

const usersReducer = (state = initialState, action) => {
  const userData = state.userData;
  const userDetails = state.userDetails;
  const likedPosts = state.userData.likedPosts;
  switch (action.type) {
    case "GET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload
      };
    case "SET_CURRENT_USER":
      return {
        ...state,
        userData: action.payload
      };
    case "NOTIFICATIONS_LOADING":
      return {
        ...state,
        notificationsLoading: true
      };
    case "FETCH_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload.notifications,
        notificationsLoading: false,
        notificationsLength: action.payload.notificationsLength
      };
    case "FOLLOWING_USER":
      return {
        ...state,
        followingUser: true
      };
    case "UNFOLLOWING_USER":
      return {
        ...state,
        unfollowingUser: true
      };
    case "FOLLOWED_USER":
      userDetails.followers_count += 1;
      userData.following.push(action.payload);

      return {
        ...state,
        followingUser: false,
        userData: userData,
        userDetails: userDetails
      };
    case "UNFOLLOWED_USER":
      const index = userData.following.indexOf(action.payload);
      userData.following.splice(index, 1);

      userDetails.followers_count -= 1;
      return {
        ...state,
        unfollowingUser: false,
        userData: userData,
        userDetails: userDetails
      };
    case "LIKED_POST":
      likedPosts.push(action.payload);

      return {
        ...state,
        likedPosts: likedPosts
      };
    case "UNLIKED_POST":
      const index1 = likedPosts.indexOf(action.payload);

      likedPosts.splice(index1, 1);

      return {
        ...state,
        likedPosts: likedPosts
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
