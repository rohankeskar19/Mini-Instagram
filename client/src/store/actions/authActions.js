import Axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwtDecode from "jwt-decode";
import { setCurrentUser } from "./usersActions";

export const loginUserWithEmail = (userData, history) => {
  return (dispatch, getState) => {
    console.log(userData);
    Axios.post("/api/user/login", {
      email: userData.loginId,
      password: userData.loginPassword
    })
      .then(res => {
        console.log(res);
        const { token } = res.data;

        localStorage.setItem("user", token);

        setAuthToken(token);

        const decoded = jwtDecode(token);

        dispatch({
          type: "LOGIN_USER",
          payload: {
            user: decoded,
            isAuthenticated: true,
            token
          }
        });
        setCurrentUser(history);
      })
      .catch(err => {
        console.log(err.response);
        dispatch({ type: "GET_ERRORS", payload: err.response.data });
      });
  };
};

export const loginUserWithUsername = (userData, history) => {
  return (dispatch, getState) => {
    console.log(userData);
    Axios.post("/api/user/login", {
      username: userData.loginId,
      password: userData.loginPassword
    })
      .then(res => {
        const { token } = res.data;

        localStorage.setItem("user", token);

        setAuthToken(token);

        const decoded = jwtDecode(token);

        dispatch({
          type: "LOGIN_USER",
          payload: {
            user: decoded,
            isAuthenticated: true,
            token
          }
        });
        dispatch(setCurrentUser(history));
      })
      .catch(err => {
        dispatch({ type: "GET_ERRORS", payload: err.response.data });
      });
  };
};

export const registerUser = (userData, history) => {
  return (dispatch, getState) => {
    Axios.post("/api/user/register", {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      password2: userData.password2,
      profileUrl: userData.profileUrl,
      bio: userData.bio
    })
      .then(res => {
        const newUserData = {
          loginId: userData.username,
          loginPassword: userData.password
        };
        dispatch(loginUserWithUsername(newUserData, history));
      })
      .catch(err => {
        dispatch({ type: "GET_ERRORS", payload: err.response.data });
      });
  };
};

export const logoutUser = history => {
  return (dispatch, getState) => {
    localStorage.removeItem("user");
    setAuthToken();
    history.push("/home-page");
    dispatch({ type: "LOGOUT_USER" });
    dispatch({ type: "CLEAR_USER" });
    dispatch({ type: "CLEAR_POST_DATA" });
  };
};
