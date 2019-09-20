import React, { Component } from "react";
import TextAreaComponent from "../common/TextAreaComponent";
import { Button, Icon, message } from "antd";
import Axios from "axios";
import { createPost, resetCreatedPost } from "../../store/actions/postsActions";
import { connect } from "react-redux";

class NewPost extends Component {
  state = {
    imageSelected: false,
    image: null,
    imageSrc: null,
    imageType: "",
    uploadingImage: false,
    imageUrl: "",
    caption: "",
    creatingPost: this.props.creatingPost,
    createdPost: this.props.createdPost
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.creatingPost !== this.props.creatingPost) {
      this.setState({
        creatingPost: this.props.creatingPost
      });
    }

    if (prevProps.feed !== this.props.feed) {
      this.setState({
        feed: this.props.feed
      });
    }

    if (prevProps.createdPost !== this.props.createdPost) {
      if (this.props.createdPost) {
        message.success("Post created");
        this.setState(
          {
            imageSelected: false,
            image: null,
            imageSrc: null,
            imageType: "",
            uploadingImage: false,
            imageUrl: "",
            caption: ""
          },
          () => {
            this.props.resetCreatedPost();
            this.props.history.push("/");
          }
        );
      }
      this.setState({
        createdPost: this.props.createdPost
      });
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleFileSelect = () => {
    if (this.state.imageSelected) {
      this.setState({
        imageSelected: false
      });
    }
    this.refs.imageSelector.click();
  };

  uploadImage = () => {
    const formData = new FormData();
    formData.append("post", this.state.image);
    Axios.post("/api/post/image-upload", formData).then(res => {
      this.setState(
        {
          imageUrl: res.data.postImageUrl,
          uploadingImage: false
        },
        () => {
          message.success("Image Uploaded!");
        }
      );
    });
  };

  isImage = file => {
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      return true;
    } else {
      message.error("File must be of type PNG,JPG or JPEG");
      return false;
    }
  };

  selectFile = e => {
    e.stopPropagation();
    e.preventDefault();

    if (this.isImage(e.target.files[0])) {
      const image = e.target.files[0];
      if (image) {
        this.setState(
          {
            image: image,
            imageSelected: true,
            imageSrc: URL.createObjectURL(image)
          },
          () => {
            const image = new Image();
            const scope = this;
            image.onload = function() {
              if (this.width > this.height) {
                scope.setImageType("landscape");
              } else if (this.width < this.height) {
                scope.setImageType("portrait");
              } else {
                scope.setImageType("square");
              }
            };
            image.src = this.state.imageSrc;
            this.uploadImage();
          }
        );
      }
    } else {
    }
  };

  setImageType = imageType => {
    this.setState({
      imageType,
      uploadingImage: true
    });
  };

  addEmoji = e => {
    this.setState({
      caption: this.state.caption + e
    });
  };

  createPost = e => {
    const { imageSelected, caption, uploadingImage } = this.state;

    if (
      imageSelected &&
      caption.length > 10 &&
      caption.length < 300 &&
      !uploadingImage
    ) {
      const postData = {
        imageUrl: this.state.imageUrl,
        caption: this.state.caption
      };
      this.props.creatPost(postData);
      this.setState({
        caption: ""
      });
    } else {
      if (!imageSelected) {
        message.error("You must select an image to upload");
      }
      if (caption.length < 10) {
        message.error("Caption must be between 10-300 characters long");
      }
      if (caption.length > 300) {
        message.error("Caption must be between 10-300 characters long");
      }
      if (uploadingImage) {
        message.error("Wait for the image to get uploaded");
      }
    }
  };
  render() {
    const {
      imageSelected,
      imageSrc,
      imageType,
      uploadingImage,

      caption
    } = this.state;
    return (
      <div className="newpost">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref="imageSelector"
          onChange={this.selectFile}
        />
        <div className="addPostImageContainer">
          <Button
            type="primary"
            className="addPostImageButton"
            onClick={this.handleFileSelect}
          >
            <Icon type="file-image" />
          </Button>
        </div>

        {imageSelected && (
          <div className="imageUploadContainer">
            {uploadingImage && (
              <Icon type="loading" className="imageUploadSpinner" />
            )}

            <img
              className={`previewImage ${imageType}`}
              src={imageSrc}
              style={{ opacity: uploadingImage ? "0.5" : "1" }}
              alt="preview"
            />
          </div>
        )}
        <div className="captionContainer">
          <TextAreaComponent
            onTextChange={this.handleChange}
            maxChar={400}
            name="caption"
            placeholder="Enter caption"
            addEmoji={this.addEmoji}
            className="textArea"
            value={caption}
          />
          <Button onClick={this.createPost} className="addPostButton">
            Add post
            <Icon type="plus" />
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    creatingPost: state.posts.creatingPost,
    createdPost: state.posts.createdPost
  };
};

const mapDispatchToProps = dispatch => {
  return {
    creatPost: postData => dispatch(createPost(postData)),
    resetCreatedPost: () => dispatch(resetCreatedPost())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPost);
