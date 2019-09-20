import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Register from "./Register";
import store from "../../store/store";
import jwtDecode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import { logoutUser } from "../../store/actions/authActions";
import { setCurrentUser } from "../../store/actions/usersActions";

class HomePage extends Component {
  componentDidMount() {
    if (localStorage.getItem("user")) {
      const token = localStorage.getItem("user");

      const decoded = jwtDecode(token);
      var currentTime = Date.now().toString();
      currentTime = currentTime.substring(0, currentTime.length - 3);
      const currentTimeNum = parseInt(currentTime);
      if (currentTimeNum > decoded.exp) {
        setAuthToken();
        store.dispatch(logoutUser(this.props.history));
      } else {
        setAuthToken(token);

        store.dispatch(setCurrentUser(this.props.history));
      }
    } else {
      setAuthToken();
      store.dispatch(logoutUser(this.props.history));
    }
  }

  render() {
    return (
      <div className="homePage">
        <Register />
      </div>
    );
  }
}

export default withRouter(HomePage);
