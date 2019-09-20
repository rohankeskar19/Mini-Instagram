const validator = {};

// Regex to check if the given string is a url
const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

validator.validatePostData = (url, caption) => {
  errors = {};
  if (urlRegex.test(url)) {
  } else {
    errors.imageUrl = "Invalid url";
  }
  if (caption) {
    if (caption.trim() != "") {
      if (caption.length < 10 || caption.length > 400) {
        errors.caption = "Caption must be between 10-400 characters long";
      }
    } else {
      errors.caption = "Invalid caption";
    }
  } else {
    errors.caption = "You must enter a caption";
  }

  return errors;
};

module.exports = validator;
