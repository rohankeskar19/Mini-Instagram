import React, { Component } from "react";
import { Button } from "antd";
import jwtDecode from "jwt-decode";
import { withRouter } from "react-router-dom";

class Dashboard extends Component {
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
      <div>
        <Button>Dashboard</Button>
      </div>
    );
  }
}

export default withRouter(Dashboard);
