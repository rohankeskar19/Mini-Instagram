import React, { Component } from "react";

import { connect } from "react-redux";
import { setCurrentUser } from "../../store/actions/usersActions";
import store from "../../store/store";
import jwtDecode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import { logoutUser } from "../../store/actions/authActions";
import FeedOutputList from "./FeedOutputList";

class Dashboard extends Component {
  state = {
    userData: this.props.userData
  };

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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      Object.keys(prevState.userData).length === 0 &&
      prevProps.userData !== this.props.userData
    ) {
      this.setState({
        userData: this.props.userData
      });
    }
  }

  render() {
    return (
      <div className="dashboard">
        <FeedOutputList />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.user.userData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: () => dispatch(setCurrentUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
