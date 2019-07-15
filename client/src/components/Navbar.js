import React, { Component } from "react";
import { Icon, Form, Input, Button } from "antd";
import { withRouter } from "react-router-dom";

import Axios from "axios";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Navbar extends Component {
  state = {
    current: this.props.location,
    loginId: "",
    password: "",
    errors: {
      loginId: "",
      password: ""
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { loginId, password } = this.state;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRegex.test(loginId)) {
      Axios.post("/api/user/login", { email: loginId, password })
        .then(res => {
          const { token } = res.data;
          localStorage.setItem("user", token);
          this.props.history.push("/dashboard");
        })
        .catch(err => {
          console.log(err.response.data);
          const { loginId, password } = err.response.data;

          if (typeof loginId !== "undefined") {
            this.setState({
              errors: {
                loginId: loginId,
                password: this.state.errors.password
              }
            });
          }
          if (typeof password !== "undefined") {
            this.setState({
              errors: {
                loginId: this.state.errors.loginId,
                password: password
              }
            });
          }
        });
    } else {
      Axios.post("/api/user/login", { username: loginId, password })
        .then(res => {
          const { token } = res.data;
          localStorage.setItem("user", token);
          this.props.history.push("/dashboard");
        })
        .catch(err => {
          console.log(err.response.data);
          const { loginId, password } = err.response.data;

          if (typeof loginId !== "undefined") {
            this.setState({
              errors: {
                loginId: loginId,
                password: this.state.errors.password
              }
            });
          }
          if (typeof password !== "undefined") {
            this.setState({
              errors: {
                loginId: this.state.errors.loginId,
                password: password
              }
            });
          }
        });
    }
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.

    return (
      <div className="navBar">
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={this.state.errors.loginId ? "error" : ""}
            help={this.state.errors.loginId || ""}
          >
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email or username"
                name="loginId"
                onChange={this.handleChange}
              />
            )}
          </Form.Item>
          <Form.Item
            validateStatus={this.state.errors.password ? "error" : ""}
            help={this.state.errors.password || ""}
          >
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
              onClick={this.handleSubmit}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: "horizontal_login" })(
  Navbar
);

export default withRouter(WrappedHorizontalLoginForm);
