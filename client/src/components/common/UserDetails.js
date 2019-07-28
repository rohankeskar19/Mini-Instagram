import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getUserDetails,
  followUser,
  unfollowUser
} from "../../store/actions/usersActions";
import { Button } from "antd";
import Gallery from "./Gallery";

export class UserDetails extends Component {
  state = {
    user: this.props.userDetails,
    userData: this.props.userData,
    followingUser: this.props.followingUser,
    unfollowingUser: this.props.unfollowingUser
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userDetails !== this.props.userDetails) {
      this.setState({
        user: this.props.userDetails
      });
    }
    if (prevProps.userData !== this.props.userData) {
      this.setState({
        userData: this.props.userData
      });
    }
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.props.getUserDetails(this.props.match.params.username);
    }
    if (prevProps.followingUser !== this.props.followingUser) {
      this.setState({
        followingUser: this.props.followingUser
      });
    }
    if (prevProps.unfollowingUser !== this.props.unfollowingUser) {
      this.setState({
        unfollowingUser: this.props.unfollowingUser
      });
    }
  }

  componentDidMount() {
    this.props.getUserDetails(this.props.match.params.username);
  }

  followUser = () => {
    const { user } = this.state;
    this.props.followUser(user.user_id);
  };

  unfollowUser = () => {
    const { user } = this.state;
    this.props.unfollowUser(user.user_id);
  };
  render() {
    const { user, userData } = this.state;
    console.log(user);
    //console.log(user.following.indexOf(userData.user_id));
    return user ? (
      <div className="userDetails">
        <div className="container">
          <div className="profile">
            <div className="profile-image">
              <img src={user.profileUrl} alt="profile" />
            </div>

            <div className="profile-user-settings">
              <p className="profile-user-name">{user.username}</p>
              {userData.user_id === user.user_id ? (
                ""
              ) : (
                <div>
                  {userData.following &&
                  userData.following.indexOf(user.user_id) > -1 ? (
                    <Button
                      type="primary"
                      className="followButton"
                      onClick={this.unfollowUser}
                      disabled={this.state.unfollowingUser}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="followButton"
                      onClick={this.followUser}
                      disabled={this.state.followingUser}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="profile-stats">
              <ul>
                <li>
                  <span className="profile-stat-count">{user.posts_count}</span>{" "}
                  posts
                </li>
                <li>
                  <span className="profile-stat-count">
                    {user.followers_count}
                  </span>{" "}
                  followers
                </li>
                <li>
                  <span className="profile-stat-count">
                    {user.following_count}
                  </span>{" "}
                  following
                </li>
              </ul>
            </div>

            <div className="profile-bio">
              <p style={{ fontSize: "1rem" }}>{user.bio}</p>
            </div>
          </div>
        </div>
        <div className="container">
          <Gallery />
        </div>
      </div>
    ) : (
      <div className="userDetails" />
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.user.userData,
    userDetails: state.user.userDetails,
    followingUser: state.user.followingUser,
    unfollowingUser: state.user.unfollowingUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserDetails: username => dispatch(getUserDetails(username)),
    followUser: username => dispatch(followUser(username)),
    unfollowUser: username => dispatch(unfollowUser(username))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);
