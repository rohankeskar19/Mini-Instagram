import React, { Component } from "react";
import { Input } from "antd";
const { TextArea } = Input;

class TextAreaComponent extends Component {
  state = {
    maxChar: this.props.maxChar,
    currentCharLength: 0,
    disabled: false,
    stringUptoLimit: ""
  };

  handleCharCount = e => {
    const length = e.target.value.length;
    this.setState({
      currentCharLength: length
    });
    if (length + 1 > this.state.maxChar) {
      e.target.value = this.state.stringUptoLimit;
      this.setState({
        disabled: true
      });
    } else {
      this.setState({
        disabled: false,
        stringUptoLimit: e.target.value
      });
    }
  };

  twoCalls = e => {
    this.props.onTextChange(e);
    this.handleCharCount(e);
  };

  render() {
    return (
      <div>
        <TextArea
          rows={4}
          onChange={this.twoCalls}
          className={!this.state.disabled ? "" : "red-border"}
          className={!this.state.error ? "" : "red-border"}
          placeholder="Enter bio"
          name="bio"
        />
        <p>
          {this.state.currentCharLength} / {this.state.maxChar}
        </p>
      </div>
    );
  }
}

export default TextAreaComponent;
