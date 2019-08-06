import Axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwtDecode from "jwt-decode";

export const getUserDetails = username => {
  return (dispatch, getState) => {
    Axios.get(`/api/user/details/?username=${username}`)
      .then(res => {
        dispatch({ type: "GET_USER_DETAILS", payload: res.data.user });
      })
      .catch(err => {});
  };
};

export const setCurrentUser = history => {
  return (dispatch, getState) => {
    const token = localStorage.getItem("user");
    setAuthToken(token);
    const decoded = jwtDecode(token);

    Axios.get(`/api/user/details/${decoded.username}`)
      .then(res => {
        dispatch({ type: "SET_CURRENT_USER", payload: res.data.user });
        dispatch({
          type: "LOGIN_USER",
          payload: {
            user: decoded,
            isAuthenticated: true,
            token
          }
        });

        history.push("/");
      })
      .catch(err => {});
  };
};

export const fetchNotifications = () => {
  return (dispatch, getState) => {
    const token = localStorage.getItem("user");
    setAuthToken(token);
    dispatch({ type: "NOTIFICATIONS_LOADING", payload: {} });
    Axios.get("/api/user/notifications")
      .then(res => {
        var count = 0;
        const notifications = res.data;

        notifications.forEach(notification => {
          if (!notification.retrieved) {
            count++;
          }
        });

        dispatch({
          type: "FETCH_NOTIFICATIONS",
          payload: {
            notifications: res.data,
            notificationsLength: count
          }
        });
      })
      .catch(err => {});
  };
};

export const followUser = userId => {
  return (dispatch, getState) => {
    dispatch({ type: "FOLLOWING_USER" });
    Axios.put("/api/user/follow", { user_id: userId })
      .then(res => {
        dispatch({ type: "FOLLOWED_USER", payload: res.data.user_id });
      })
      .catch(err => {});
  };
};

export const unfollowUser = userId => {
  return (dispatch, getState) => {
    dispatch({ type: "UNFOLLOWING_USER" });
    Axios.put("/api/user/unfollow", { user_id: userId })
      .then(res => {
        dispatch({ type: "UNFOLLOWED_USER", payload: res.data.user_id });
      })
      .catch(err => {});
  };
};
