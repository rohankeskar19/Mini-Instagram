const validator = {};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

validator.validatePostData = (url, caption) => {
  errors = {};
  if (urlRegex.test(url)) {
  } else {
    errors.imageUrl = "Invalid url";
  }
  if (caption) {
    if (caption.trim() != "") {
    } else {
      errors.caption = "Invalid caption";
    }
  } else {
    errors.caption = "You must enter a caption";
  }
  return errors;
};

module.exports = validator;
