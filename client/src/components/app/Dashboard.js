import React, { Component } from "react";

import { connect } from "react-redux";
import { setCurrentUser } from "../../store/actions/usersActions";
import Feed from "./Feed";

class Dashboard extends Component {
  state = {
    userData: this.props.userData
  };

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
        <Feed />
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
