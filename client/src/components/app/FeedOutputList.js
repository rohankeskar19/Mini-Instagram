import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchFeed } from "../../store/actions/postsActions";

class FeedOutputList extends Component {
  state = {
    feed: this.props.feed,
    isAuthenticated: this.props.isAuthenticated
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.feed !== this.props.feed) {
      this.setState({
        feed: this.props.feed
      });
    }
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState(
        {
          isAuthenticated: this.props.isAuthenticated
        },
        () => {
          if (this.state.isAuthenticated) {
            this.props.fetchFeed();
          }
        }
      );
    }
  }

  render() {
    return (
      <div>
        <p>{this.state.feed && this.state.feed.length} </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    feed: state.user.feed,
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFeed: () => dispatch(fetchFeed())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedOutputList);
