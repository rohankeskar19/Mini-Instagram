import React, { Component } from "react";
import {
  Badge,
  Icon,
  Input,
  Popover,
  Tooltip,
  Form,
  Button,
  AutoComplete,
  Avatar
} from "antd";
import { connect } from "react-redux";
import NotificationsList from "../app/Lists/NotificationsList";
import { fetchNotifications } from "../../store/actions/usersActions";
import {
  logoutUser,
  loginUserWithEmail,
  loginUserWithUsername
} from "../../store/actions/authActions";
import { Link, withRouter } from "react-router-dom";
import { debounce } from "throttle-debounce";
import Axios from "axios";

const { Option } = AutoComplete;

const renderOption = user => {
  return (
    <Option key={user.username} text={user.username}>
      <div className="global-search-item" key={user.username}>
        <span className="global-search-item-desc" style={{ padding: "0.5rem" }}>
          <Avatar src={user.profileUrl} style={{ marginRight: "0.8rem" }} />
          <p style={{ display: "inline", marginLeft: "0.5rem" }}>
            {user.username}
          </p>
        </span>
      </div>
    </Option>
  );
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Navbar extends Component {
  state = {
    isAuthenticated: this.props.isAuthenticated,
    searchField: "",
    user: this.props.user,
    notificationsLoading: this.props.notificationsLoading,
    notifications: this.props.notifications,
    notificationslength: this.props.notificationsLength,
    notificationsOpened: false,
    searchResult: [],
    loginId: "",
    loginPassword: "",
    errors: {
      loginId: this.props.errors.loginId,
      loginPassword: this.props.errors.loginPassword
    },
    loginInProgress: false
  };

  constructor(props) {
    super(props);
    this.autoCompleteSearch = debounce(500, this.searchUsers);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        user: this.props.user
      });
    }
    if (prevProps.notificationsLoading !== this.props.notificationsLoading) {
      this.setState({
        notificationsLoading: this.props.notificationsLoading
      });
    }
    if (prevProps.notifications !== this.props.notifications) {
      this.setState({
        notifications: this.props.notifications
      });
    }
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState(
        {
          isAuthenticated: this.props.isAuthenticated
        },
        () => {
          if (this.state.isAuthenticated) {
            this.setState(
              {
                loginId: "",
                loginPassword: "",
                loginInProgress: false
              },
              () => {
                this.props.fetchNotifications();
              }
            );
          } else {
            this.setState({
              searchField: ""
            });
          }
        }
      );
    }
    if (prevProps.errors !== this.props.errors) {
      const { errors } = this.props;

      this.setState({
        errors: {
          loginId: errors.loginId,
          loginPassword: errors.loginPassword
        },
        loginInProgress: false
      });
    }
    if (prevProps.notificationsLength !== this.props.notificationsLength) {
      this.setState({
        notificationsLength: this.props.notificationsLength
      });
    }
  }

  handleChange = value => {
    if (value !== "") {
      this.setState(
        {
          searchField: value
        },
        () => {
          this.autoCompleteSearch();
        }
      );
    } else {
      this.setState({
        searchResult: []
      });
    }
  };

  handleLoginChange = e => {
    if (e.target.value !== "") {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  searchUsers = () => {
    if (this.state.searchField !== "" && this.state.isAuthenticated) {
      Axios.post("/api/user/users", { username: this.state.searchField })
        .then(res => {
          this.setState({
            searchResult: res.data.users
          });
        })
        .catch(err => {});
    }
  };

  getNotifications = () => {
    const { notificationsOpened } = this.state;

    if (notificationsOpened) {
      this.props.fetchNotifications();
      this.setState({
        notificationLength: 0,
        notificationsOpened: true
      });
    } else {
      this.setState({
        notificationLength: 0,
        notificationsOpened: true
      });
    }
    this.setState({
      notificationLength: 0
    });
  };

  logoutUser = () => {
    this.setState({
      searchField: ""
    });
    this.props.logoutUser(this.props.history);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState(
      {
        loginInProgress: true
      },
      () => {
        const { loginId, loginPassword } = this.state;

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const userData = {
          loginId,
          loginPassword
        };

        if (emailRegex.test(loginId)) {
          this.props.loginUserWithEmail(userData, this.props.history);
        } else {
          this.props.loginUserWithUsername(userData, this.props.history);
        }
      }
    );
  };

  onSelect = value => {
    this.props.history.push(`/user/${value}`);
  };

  render() {
    const {
      user,
      notifications,
      notificationsLoading,
      notificationsLength,
      searchResult,
      isAuthenticated,
      errors
    } = this.state;
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const authenticatedUi = (
      <div className="navBar__signedIn">
        <AutoComplete
          dataSource={searchResult.map(renderOption)}
          className="searchField"
          onSearch={this.handleChange}
          onSelect={this.onSelect}
          optionLabelProp="text"
        >
          <Input
            suffix={<Icon type="search" className="certain-category-icon" />}
          />
        </AutoComplete>
        <div className="profileContainer">
          <Link to="/post/new" className="newPostBtn">
            <Button>
              <Icon type="plus" />
            </Button>
          </Link>

          <Popover
            className="notificationsPopover"
            placement="bottom"
            trigger="click"
            content={
              notificationsLoading ? (
                <Icon type="loading" />
              ) : (
                <NotificationsList notifications={notifications} />
              )
            }
          >
            <Badge
              count={notificationsLength > 0 ? notificationsLength : ""}
              className="notifications"
              onClick={this.getNotifications}
            >
              <Icon type="bell" className="bellicon" />
            </Badge>
          </Popover>
          <Link to={`/user/${user.username}`}>
            <Tooltip placement="bottom" title={"Your account"}>
              <img
                src={user.profileUrl}
                alt="profile"
                className="navBar__profile"
              />
            </Tooltip>
          </Link>
          <Tooltip title="Log out" placement="bottom">
            <Icon
              type="logout"
              className="navbarLogout"
              onClick={this.logoutUser}
            />
          </Tooltip>
        </div>
      </div>
    );

    const guestUi = (
      <Form.Item className="navBar">
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={errors.loginId ? "error" : ""}
            help={errors.loginId || ""}
          >
            {getFieldDecorator("loginId", {
              rules: [
                {
                  required: true,
                  message: "Please input your Email or username!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email or username"
                name="loginId"
                onChange={this.handleLoginChange}
              />
            )}
          </Form.Item>
          <Form.Item
            validateStatus={errors.loginPassword ? "error" : ""}
            help={errors.loginPassword || ""}
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
                name="loginPassword"
                onChange={this.handleLoginChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                hasErrors(getFieldsError()) || this.state.loginInProgress
              }
              onClick={this.handleSubmit}
            >
              {this.state.loginInProgress ? (
                <Icon type="loading" style={{ color: "#333" }} />
              ) : (
                "Log in"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Form.Item>
    );

    return isAuthenticated && Object.keys(user).length > 0
      ? authenticatedUi
      : guestUi;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.userData,
    notificationsLoading: state.user.notiicationsLoading,
    notificationsLength: state.user.notificationsLength,
    notifications: state.user.notifications,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchNotifications: () => dispatch(fetchNotifications()),
    logoutUser: history => dispatch(logoutUser(history)),
    loginUserWithEmail: (userData, history) =>
      dispatch(loginUserWithEmail(userData, history)),
    loginUserWithUsername: (userData, history) =>
      dispatch(loginUserWithUsername(userData, history))
  };
};

const NavbarToExport = Form.create({ name: "navbar" })(Navbar);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavbarToExport)
);
