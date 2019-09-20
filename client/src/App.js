import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import jwtDecode from "jwt-decode";
import store from "./store/store";

import HomePage from "./components/homepage/HomePage";

import Dashboard from "./components/app/Dashboard";
import NewPost from "./components/app/NewPost";
import PostDetails from "./components/app/PostDetails";

import Navbar from "./components/common/Navbar";
import UserDetails from "./components/app/UserDetails";

import { Provider } from "react-redux";
import { logoutUser } from "./store/actions/authActions";
import { setCurrentUser } from "./store/actions/usersActions";

class App extends Component {
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
      <Provider store={store}>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/home-page" component={HomePage} exact />
            <Route path="/" component={Dashboard} exact />
            <Route path="/post/new" component={NewPost} exact />
            <Route path="/user/:username" component={UserDetails} exact />
            <Route path="/post/:post_id" component={PostDetails} exact />
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);
