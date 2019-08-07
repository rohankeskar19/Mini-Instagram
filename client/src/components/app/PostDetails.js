import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getPostData,
  likePost,
  unlikePost,
  addComment,
  refreshComments
} from "../../store/actions/postsActions";
import { Icon, Tooltip, Button, message } from "antd";
import { Link } from "react-router-dom";
import TextAreaComponent from "../common/TextAreaComponent";
import CommentList from "./Lists/CommentList";

export class PostDetails extends Component {
  state = {
    postData: this.props.postDetails,
    comment: "",
    loading: true,
    commentsLoading: this.props.commentsLoading
  };

  componentDidMount() {
    this.props.getPostData(this.props.match.params.post_id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.postDetails !== this.props.postDetails) {
      this.setState({
        postData: this.props.postDetails,
        loading: false
      });
    }
  }

  handleChange = e => {
    this.setState({
      comment: e.target.value
    });
  };

  addEmoji = emoji => {
    this.setState({
      comment: this.state.comment + emoji
    });
  };

  addComment = () => {
    const { comment, postData } = this.state;

    if (comment.trim().length > 400 || comment.trim().length < 10) {
      message.error("Comment must be between 10-400 characters long");
    } else {
      this.setState(
        {
          comment: ""
        },
        () => {
          this.props.addComment(postData.id, comment);
        }
      );
    }
  };
  render() {
    const { postData, loading, commentsLoading } = this.state;
    const { liked, comments } = postData;

    const captionAsComment = {
      username: postData.username,
      profileUrl: postData.profileUrl,
      content: postData.caption
    };

    return loading ? (
      <Icon type="loading" className="center" />
    ) : (
      <div className="postDetails">
        {postData && (
          <div className="postDetailsContainer">
            <div className="postImage">
              <img src={postData.imageUrl} alt={postData.caption} />
            </div>
            <div className="postContent">
              <div className="postContent__header">
                <Link
                  to={`/user/${postData.username}`}
                  className="postContent__headerContent"
                >
                  <img
                    src={postData.profileUrl}
                    alt={postData.username}
                    className="postContent__profileImage"
                  />
                  <p className="postContent__username">{postData.username}</p>
                </Link>
              </div>

              <div className="postComments">
                {commentsLoading ? (
                  <Icon type="loading" className="center commentsSpinner" />
                ) : (
                  <CommentList
                    comments={comments}
                    captionAsComment={captionAsComment}
                  />
                )}

                <div className="commentsInput">
                  <TextAreaComponent
                    className="commentsInputArea"
                    maxChar={400}
                    onTextChange={this.handleChange}
                    addEmoji={this.addEmoji}
                    value={this.state.comment}
                    name="comment"
                    ref="commentInputArea"
                  />
                  <Button
                    type="primary"
                    className="addCommentButton"
                    onClick={this.addComment}
                  >
                    {this.props.addingComment ? (
                      <Icon type="loading" style={{ color: "#fff" }} />
                    ) : (
                      <Icon type="plus" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="postInfo">
                <div className="postActions">
                  {liked ? (
                    <Tooltip title="Unlike post">
                      <Icon
                        type="heart"
                        className="likePost"
                        theme="filled"
                        style={{ color: "#d41c00" }}
                        onClick={() => this.props.unlikePost(postData.id)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Like post">
                      <Icon
                        type="heart"
                        className="likePost"
                        onClick={() => this.props.likePost(postData.id)}
                      />
                    </Tooltip>
                  )}
                </div>
                <Tooltip title="Refresh comments">
                  <Icon
                    type="reload"
                    className="reloadComments"
                    onClick={() => this.props.refreshComments(postData.id)}
                    spin={this.props.commentsLoading}
                  />
                </Tooltip>
              </div>
              <div />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    postDetails: state.posts.postDetails,
    commentsLoading: state.posts.commentsLoading,
    addingComment: state.posts.addingComment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPostData: postId => dispatch(getPostData(postId)),
    likePost: postId => dispatch(likePost(postId)),
    unlikePost: postId => dispatch(unlikePost(postId)),
    addComment: (postId, comment) => dispatch(addComment(postId, comment)),
    refreshComments: postId => dispatch(refreshComments(postId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostDetails);
