import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Register from "./auth/Register";

class HomePage extends Component {
  render() {
    return (
      <div className="homePage">
        <Register />
      </div>
    );
  }
}

export default withRouter(HomePage);
