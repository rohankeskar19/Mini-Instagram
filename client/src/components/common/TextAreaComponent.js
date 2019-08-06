import React, { Component } from "react";
import { Input, Icon } from "antd";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const { TextArea } = Input;

class TextAreaComponent extends Component {
  state = {
    maxChar: this.props.maxChar,
    currentCharLength: 0,
    disabled: false,
    stringUptoLimit: "",
    emojiDialogVisible: false
  };

  componentDidMount() {
    const value = document.getElementById("textarea").value;
    this.setState({
      stringUptoLimit: value,
      currentCharLength: value.length
    });
  }

  handleCharCount = e => {
    const length = e.target.value.length;
    this.setState({
      currentCharLength: length,
      stringUptoLimit: e.target.value
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

  addEmoji = emoji => {
    if (!this.state.disabled) {
      this.setState(
        {
          stringUptoLimit: this.state.stringUptoLimit + emoji.native,
          currentCharLength: this.state.currentCharLength + 1
        },
        () => {
          const length = this.state.currentCharLength;

          if (length + 1 > this.state.maxChar) {
            this.setState({
              disabled: true
            });
          } else {
            this.setState({
              disabled: false,
              stringUptoLimit: this.state.stringUptoLimit
            });
          }
        }
      );
    }
  };

  handleSelect = e => {
    this.props.addEmoji(e.native);
    this.addEmoji(e);
  };

  toggleEmojiPicker = () => {
    this.setState({
      emojiDialogVisible: !this.state.emojiDialogVisible
    });
  };

  hidePicker = () => {
    this.setState({
      emojiDialogVisible: false
    });
  };

  handleBackSpace = e => {
    const keyCode = e.keyCode;
    if (this.state.disabled && keyCode === 8) {
      this.setState(
        {
          stringUptoLimit: this.state.stringUptoLimit.slice(
            0,
            this.state.currentCharLength - 1
          ),
          disabled: false
        },
        () => {
          this.setState({
            currentCharLength: this.state.stringUptoLimit.length
          });
        }
      );
    }
  };

  render() {
    return (
      <div className={this.props.className}>
        <Icon
          type="smile"
          onClick={this.toggleEmojiPicker}
          className="emojiButton"
        />
        {this.state.emojiDialogVisible && (
          <div className="emojiPicker">
            <Picker set="apple" onSelect={this.handleSelect} />
          </div>
        )}

        <TextArea
          rows={4}
          onChange={this.twoCalls}
          className={
            !this.state.disabled || !this.state.error ? "" : "red-border"
          }
          placeholder={this.props.placeholder}
          name={this.props.name}
          value={this.state.stringUptoLimit}
          onFocus={this.hidePicker}
          id="textarea"
          readOnly={this.state.disabled}
          onKeyDown={this.handleBackSpace}
        />
        <p>
          {this.state.currentCharLength} / {this.state.maxChar}
        </p>
      </div>
    );
  }
}

export default TextAreaComponent;
