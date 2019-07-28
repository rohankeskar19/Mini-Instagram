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
      const userData = state.userData;
      const userDetails = state.userDetails;
      userDetails.followers_count += 1;
      userData.following.push(action.payload);

      return {
        ...state,
        followingUser: false,
        userData: userData,
        userDetails: userDetails
      };
    case "UNFOLLOWED_USER":
      const userData1 = state.userData;
      const index = userData1.following.indexOf(action.payload);
      userData1.following.splice(index, 1);
      const userDetails1 = state.userDetails;
      userDetails1.followers_count -= 1;
      return {
        ...state,
        unfollowingUser: false,
        userData: userData1
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
