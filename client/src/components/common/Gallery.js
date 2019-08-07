import React, { Component } from "react";
import { connect } from "react-redux";
import GalleryItem from "../app/ListItems/GalleryItem";

export class Gallery extends Component {
  state = {
    posts: this.props.posts
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.posts !== this.props.posts) {
      this.setState({
        posts: this.props.posts
      });
    }
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="gallery">
        {posts && posts.map(post => <GalleryItem post={post} key={post.id} />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.user.userDetails.posts
  };
};

export default connect(
  mapStateToProps,
  null
)(Gallery);
