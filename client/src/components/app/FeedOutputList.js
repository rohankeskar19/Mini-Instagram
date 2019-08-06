import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchFeed,
  likePost,
  unlikePost,
  resetFeedUpdated
} from "../../store/actions/postsActions";
import { Icon } from "antd";
import LinesEllipsis from "react-lines-ellipsis";
import StackGrid from "react-stack-grid";
import { Link } from "react-router-dom";

class FeedOutputList extends Component {
  state = {
    feed: this.props.feed,
    isAuthenticated: this.props.isAuthenticated,
    feedUpdated: this.props.feedUpdated,
    windowWidth: "",
    loading: true
  };

  getColumnWidth = () => {
    const { windowWidth } = this.state;

    if (windowWidth >= 1200) {
      return "25%";
    }
    if (windowWidth >= 1024) {
      return "30%";
    }
    if (windowWidth >= 768) {
      return "50%";
    }
    if (windowWidth >= 640) {
      return "100%";
    } else {
      return "100%";
    }
  };

  componentDidMount() {
    this.setState(
      {
        windowWidth: window.innerWidth
      },
      () => {
        console.log(this.getColumnWidth());
      }
    );
    if (this.state.isAuthenticated) {
      this.props.fetchFeed();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.feedUpdated !== this.props.feedUpdated) {
      this.setState(
        {
          feedUpdated: this.props.feedUpdated,
          feed: this.props.feed
        },
        () => {
          this.props.resetFeedUpdated();
        }
      );
    }
    if (prevProps.feed !== this.props.feed) {
      this.setState({
        feed: this.props.feed,
        loading: false
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
    const { feed, loading } = this.state;

    return loading ? (
      <Icon type="loading" className="center" />
    ) : (
      <div className="feedOutput">
        <StackGrid columnWidth={this.getColumnWidth()} style={{ zIndex: "0" }}>
          {feed &&
            feed.map(post => (
              <div className="feedItem" key={post._id}>
                <Link to={`/user/${post.username}`}>
                  <p className="feedItemUsername">{post.username}</p>
                </Link>
                <Link to={`/post/${post._id}`}>
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="feedItemImage"
                  />
                </Link>

                <div className="content">
                  <LinesEllipsis
                    text={post.caption}
                    className="feedItemCaption"
                    maxLine="3"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                  />

                  {post.liked ? (
                    <Icon
                      type="heart"
                      className="likeButton"
                      theme="filled"
                      style={{ color: "#d41c00" }}
                      onClick={() => this.props.unlikePost(post._id)}
                    />
                  ) : (
                    <Icon
                      type="heart"
                      className="likeButton"
                      onClick={() => this.props.likePost(post._id)}
                      style={{ color: "#333" }}
                    />
                  )}
                </div>
              </div>
            ))}
        </StackGrid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    feed: state.posts.feed,
    isAuthenticated: state.auth.isAuthenticated,
    feedUpdated: state.posts.feedUpdated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFeed: () => dispatch(fetchFeed()),
    likePost: postId => dispatch(likePost(postId)),
    unlikePost: postId => dispatch(unlikePost(postId)),
    resetFeedUpdated: () => dispatch(resetFeedUpdated())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedOutputList);
