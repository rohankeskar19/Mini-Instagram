import React, { Component } from "react";
import { Steps, Button, message, Form, Icon, Input } from "antd";
import TextAreaComponent from "../common/TextAreaComponent";
import Axios from "axios";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { registerUser } from "../../store/actions/authActions";

const { Step } = Steps;

class Register extends Component {
  state = {
    current: 0,
    getFieldDecorator: this.props.form.getFieldDecorator,
    email: "",
    username: "",
    password: "",
    password2: "",
    bio: "",
    imageSelected: false,
    imageSource: null,
    image: null,
    profileUrl: "",
    uploading: false,
    creatingAccount: false,

    imagePreviewCanvas: React.createRef(),
    errors: {
      email: this.props.errors.email,
      username: this.props.errors.username,
      password: this.props.errors.password,
      password2: this.props.errors.password2
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.errors !== this.props.errors) {
      this.setState(
        {
          errors: this.props.errors
        },
        () => {
          this.updateErrors();
        }
      );
    }
  }

  updateErrors = () => {
    const { errors } = this.state;

    if (errors.email !== undefined) {
      this.setState({
        current: 0,
        creatingAccount: false
      });
    }
    if (errors.username !== undefined) {
      this.setState({
        current: 0,
        creatingAccount: false
      });
    }
    if (errors.profileUrl !== undefined) {
      this.setState({
        current: 1,
        creatingAccount: false
      });
    }
    if (errors.bio !== undefined) {
      this.setState({
        bio: 2,
        creatingAccount: false
      });
    }
  };

  addEmoji = emoji => {
    this.setState({
      bio: this.state.bio.concat(emoji)
    });
  };

  validateCredentialsInput = () => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { email, username, password, password2 } = this.state;

    if (email.trim() === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          email: "Please enter an email"
        }
      });
      return false;
    }
    if (!emailRegex.test(email)) {
      this.setState({
        errors: {
          ...this.state.errors,
          email: "Please enter an valid email"
        }
      });
      return false;
    }
    if (username.trim() === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          username: "Please enter an username"
        }
      });
      return false;
    }
    if (username.length < 6 || username.length > 32) {
      this.setState({
        errors: {
          ...this.state.errors,
          username: "Username must be 6-32 characters long"
        }
      });
      return false;
    }
    if (password === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          password: "Please enter a password"
        }
      });
      return false;
    }
    if (password2 === "") {
      this.setState({
        errors: {
          ...this.state.errors,
          password2: "Please enter a password"
        }
      });
      return false;
    }
    if (password.length < 6 || password.length > 30) {
      this.setState({
        errors: {
          ...this.state.errors,
          password: "Password must be between 6 to 30 characters",
          password2: "Password must be between 6 to 30 characters"
        }
      });
      return false;
    }
    if (password !== password2) {
      this.setState({
        errors: {
          ...this.state.errors,
          password: "Passwords do not match",
          password2: "Passwords do not match"
        }
      });
      return false;
    }

    return true;
  };

  uploadImage = () => {
    const { image } = this.state;

    const formData = new FormData();
    formData.append("profile", image);
    try {
      this.setState(
        {
          uploading: true
        },
        () => {
          Axios.post("/api/user/profile-upload", formData, {
            "Content-Type": "multipart/form-data"
          })
            .then(res => {
              this.setState(
                {
                  profileUrl: res.data.profileUrl,
                  current: this.state.current + 1,
                  uploading: false
                },
                () => {
                  message.success("Profile image uploaded");
                }
              );
            })
            .catch(err => {});
        }
      );
    } catch (e) {
      throw e;
    }
  };

  uploadData = () => {
    const {
      email,
      username,
      password,
      password2,
      profileUrl,
      bio
    } = this.state;

    try {
      this.setState(
        {
          creatingAccount: true
        },
        () => {
          const userData = {
            email,
            username,
            password,
            password2,
            profileUrl,
            bio
          };
          this.props.registerUser(userData, this.props.history);
        }
      );
    } catch (e) {
      throw e;
    }
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

  handleImageSelect = e => {
    if (e.target.files[0]) {
      if (this.isImage(e.target.files[0])) {
        const imageSource = URL.createObjectURL(e.target.files[0]);
        if (imageSource) {
          this.setState(
            {
              imageSource,
              imageSelected: true,
              image: e.target.files[0]
            },
            () => {
              this.uploadImage();
            }
          );
        } else {
          message.error("Please select an profile image to continue");
        }
      } else {
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  openFileSelector = e => {
    this.refs.profileImageSelecter.click();
  };

  firstStepContent = () => (
    <Form className="firstPage" onSubmit={this.handleSubmit}>
      <Form.Item
        {...this.state.errors.email && {
          help: this.state.errors.email,
          validateStatus: "error"
        }}
      >
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Enter email"
          name="email"
          onChange={this.handleChange}
          type="email"
          value={this.state.email}
        />
      </Form.Item>
      <Form.Item
        {...this.state.errors.username && {
          help: this.state.errors.username,
          validateStatus: "error"
        }}
      >
        <Input
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Enter username "
          name="username"
          onChange={this.handleChange}
          type="text"
          value={this.state.username}
        />
      </Form.Item>
      <Form.Item
        {...this.state.errors.password && {
          help: this.state.errors.password,
          validateStatus: "error"
        }}
      >
        <Input.Password
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Enter password"
          name="password"
          onChange={this.handleChange}
          type="password"
          value={this.state.password}
        />
      </Form.Item>
      <Form.Item
        {...this.state.errors.password2 && {
          help: this.state.errors.password2,
          validateStatus: "error"
        }}
      >
        <Input.Password
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Confirm password"
          name="password2"
          onChange={this.handleChange}
          value={this.state.password2}
        />
      </Form.Item>
    </Form>
  );

  uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Select a profile photo</div>
    </div>
  );

  secondStepContent = () => (
    <div className="imageUpload">
      <div className="imageBox">
        {this.state.imageSource ? (
          <div className="imageBox1">
            <h4 className="imageMessage">Drag to crop the image</h4>
            <div className="imagePreviewContainer">
              <img
                src={this.state.imageSource}
                alt="profile"
                className="profileImagePreview"
              />
            </div>

            {this.state.uploading ? (
              <div className="profileSpinner">
                <p className="imageMessage">Uploading image...(Please Wait)</p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              ref="profileImageSelecter"
              onChange={this.handleImageSelect}
              style={{ display: "none" }}
            />

            <Button
              type="primary"
              onClick={this.openFileSelector}
              className="profileImageSelector"
            >
              <Icon type="file-image" />
            </Button>
            <div className="imageMessage">
              <h4>Select an profile image</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  thirdStepContent = () => (
    <div>
      <TextAreaComponent
        maxChar={100}
        onTextChange={this.handleChange}
        error={this.state.errors.bio}
        addEmoji={this.addEmoji}
        value={this.state.bio}
        name="bio"
        placeholder="Enter bio"
        className="textAreaComponent"
      />
    </div>
  );

  steps = [
    {
      title: "Login Credentials",
      content: this.firstStepContent
    },
    {
      title: "Profile Image",
      content: this.secondStepContent
    },
    {
      title: "Bio",
      content: this.thirdStepContent
    }
  ];

  next = () => {
    const { current } = this.state;
    switch (current) {
      case 0:
        if (this.validateCredentialsInput()) {
          this.setState({
            current: this.state.current + 1,
            errors: {
              email: "",
              username: "",
              password: "",
              password2: ""
            }
          });
        }
        break;
      case 1:
        if (this.state.imageSelected && this.state.profileUrl === "") {
          this.uploadImage();
        } else if (!this.state.imageSelected) {
          message.error("Please select an profile image to continue");
        } else {
          this.setState({
            current: this.state.current + 1
          });
        }
        break;

      default:
        this.setState({
          current: this.state.current + 1
        });
        break;
    }
  };

  prev = () => {
    this.setState({
      current: this.state.current - 1
    });
  };

  render() {
    const { current } = this.state;
    return (
      <div className="registerComponent">
        <h2 className="registerHeading">Create Account</h2>
        <Steps current={current}>
          {this.steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{this.steps[current].content()}</div>
        <div className="steps-action">
          {current < this.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => this.next()}
              disabled={this.state.uploading}
            >
              Next
            </Button>
          )}
          {current === this.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => this.uploadData()}
              disabled={this.state.creatingAccount}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const WrappedRegisterForm = Form.create({ name: "register" })(Register);

const mapStateToProps = state => {
  return {
    errors: state.auth.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registerUser: (userData, history) =>
      dispatch(registerUser(userData, history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WrappedRegisterForm));
