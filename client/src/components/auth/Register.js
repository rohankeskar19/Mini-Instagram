import React, { Component } from "react";
import { Steps, Button, message, Form, Icon, Input, Spin } from "antd";
import TextAreaComponent from "./TextAreaComponent";
import Axios from "axios";
import { withRouter } from "react-router-dom";

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
    imageFile: null,
    profileUrl: "",
    uploading: false,
    creatingAccount: false,
    errors: {
      email: "",
      username: "",
      password: "",
      password2: ""
    }
  };

  validateCredentialsInput = () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { email, username, password, password2 } = this.state;

    if (email.trim() === "") {
      console.log("error");
      this.setState({
        errors: {
          email: "Please enter an email",
          username: this.state.errors.username,
          password: this.state.errors.password,
          password2: this.state.errors.password2
        }
      });
      return false;
    }
    if (!emailRegex.test(email)) {
      this.setState({
        errors: {
          email: "Please enter an valid email",
          username: this.state.errors.username,
          password: this.state.errors.password,
          password2: this.state.errors.password2
        }
      });
      return false;
    }
    if (username.trim() === "") {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: "Please enter an username",
          password: this.state.errors.password,
          password2: this.state.errors.password2
        }
      });
      return false;
    }
    if (username.length < 6 || username.length > 32) {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: "Username must be 6-32 characters long",
          password: this.state.errors.password,
          password2: this.state.errors.password2
        }
      });
      return false;
    }
    if (password === "") {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: this.state.errors.username,
          password: "Please enter a password",
          password2: this.state.errors.password2
        }
      });
      return false;
    }
    if (password2 === "") {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: this.state.errors.username,
          password: this.state.errors.password,
          password2: "Please enter a password"
        }
      });
      return false;
    }
    if (password.length < 6 || password.length > 30) {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: this.state.errors.username,
          password: "Password must be between 6 to 30 characters",
          password2: "Password must be between 6 to 30 characters"
        }
      });
      return false;
    }
    if (password !== password2) {
      this.setState({
        errors: {
          email: this.state.errors.email,
          username: this.state.errors.username,
          password: "Passwords do not match",
          password2: "Passwords do not match"
        }
      });
      return false;
    }

    return true;
  };

  uploadImage = () => {
    const formData = new FormData();
    formData.append("profile", this.state.imageFile);
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
            .catch(err => {
              console.log(err);
            });
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
          Axios.post("/api/user/register", {
            email,
            username,
            password,
            password2,
            profileUrl,
            bio
          })
            .then(res => {
              this.setState(
                {
                  creatingAccount: false
                },
                () => {
                  Axios.post("/api/user/login", { username, password })
                    .then(res => {
                      const { token } = res.data;

                      localStorage.setItem("user", token);

                      this.props.history.push("/dashboard");
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              );
            })
            .catch(err => {
              const error = err.response.data;
              this.setState({
                creatingAccount: false
              });
              if (
                typeof error.email !== "undefined" ||
                typeof error.username !== "undefined"
              ) {
                this.setState(
                  {
                    current: 0
                  },
                  () => {
                    if (typeof error.email !== "undefined") {
                      this.setState({
                        errors: {
                          email: error.email,
                          username: this.state.errors.username,
                          password: this.state.errors.password,
                          password2: this.state.errors.password2
                        }
                      });
                    } else if (typeof error.username !== "undefined") {
                      this.setState({
                        errors: {
                          email: this.state.errors.email,
                          username: error.username,
                          password: this.state.errors.password,
                          password2: this.state.errors.password2
                        }
                      });
                    }
                  }
                );
              }
            });
        }
      );
    } catch (e) {
      throw e;
    }
  };

  onChange = e => {
    this.setState({
      imageSource: URL.createObjectURL(e.target.files[0]),
      imageFile: e.target.files[0],
      imageSelected: true
    });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
            <input
              className="fileSelect"
              type="file"
              accept="image/*"
              onChange={this.onChange}
              style={{ opacity: "0", height: "0px" }}
            />
            <img src={this.state.imageSource} className="profileImage" />
            {this.state.uploading ? (
              <div className="profileSpinner">
                <p>Uploading image...(Please Wait)</p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            <input
              className="fileSelect"
              type="file"
              accept="image/*"
              onChange={this.onChange}
              style={{ opacity: "0" }}
            />
            <div className="imageMessage">
              <Icon type="plus" />

              <p>Select an profile image</p>
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

export default withRouter(WrappedRegisterForm);
