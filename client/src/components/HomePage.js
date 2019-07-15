import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Register from "./auth/Register";
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";

class HomePage extends Component {
  componentDidMount() {
    const token = localStorage.getItem("user");

    if (token) {
      const decoded = jwtDecode(token);

      if (Date.now() < decoded.exp) {
        console.log("logged out");
        this.props.history.push("/");
      } else {
        console.log("logged in");
        this.props.history.push("/dashboard");
      }
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="homePage">
        <Navbar />
        <Register />
      </div>
    );
  }
}

export default withRouter(HomePage);
