const validator = {};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

validator.validateRegisterData = (
  email,
  username,
  profileUrl,
  bio,
  password,
  password2
) => {
  console.log(email, username, profileUrl, bio, password, password2);
  const errors = {};
  if (email && username && profileUrl && bio && password && password2) {
    if (email.trim() != "") {
      if (emailRegex.test(email)) {
      } else {
        errors.email = "Enter a valid email";
      }
    } else {
      errors.email = "Enter a valid email";
    }
    if (username.trim() != "") {
      if (username.length < 6 || username.length > 32) {
        errors.username = "Username must be between 6 to 32 characters";
      }
    } else {
      errors.username = "Enter a valid username";
    }
    if (profileUrl.trim() != "") {
      if (urlRegex.test(profileUrl)) {
      } else {
        errors.profileUrl = "Invalid data";
      }
    } else {
      errors.profileUrl = "Invalid data";
    }
    if (bio.trim() != "") {
      if (bio.length > 100 || bio.length < 8) {
        errors.bio = "Bio must be 8 to 100 characters long";
      }
    } else {
      errors.bio = "Enter a valid bio";
    }
    if (password.trim() != "") {
      if (password.length < 6 || password.length > 30) {
        errors.password = "Password must be 6-30 characters long";
      }
    } else {
      errors.password = "Enter a valid password";
    }
    if (password2.trim() != "") {
      if (password2.length < 6 || password2.length > 30) {
        errors.password2 = "Password must be 6-30 characters long";
      }
    } else {
      errors.password2 = "Enter a valid password";
    }
    if (password != password2) {
      errors.password = "Passwords do not match";
      errors.password2 = "Passwords do not match";
    }
  } else {
    if (!email) {
      errors.email = "Email not entered";
    }
    if (!username) {
      errors.username = "Username not entered";
    }
    if (!profileUrl) {
      errors.profileUrl = "Profile image not selected";
    }
    if (!bio) {
      errors.bio = "Bio not entered";
    }
    if (!password) {
      errors.password = "Password not entered";
    }
    if (!password2) {
      errors.password2 = "Password confirmation required";
    }
  }

  return errors;
};

validator.validateLoginData = (loginId, password, flag) => {
  const errors = {};

  if (flag == 0) {
    if (loginId.trim() != "") {
      if (emailRegex.test(loginId)) {
      } else {
        errors.loginId = "Enter a valid email";
      }
    } else {
      errors.loginId = "Enter a valid email";
    }
  } else {
    if (loginId.trim() != "") {
      if (loginId.length < 6 || loginId.length > 32) {
        errors.loginId = "Username must be between 6 to 32 characters";
      }
    } else {
      errors.loginId = "Enter a valid username";
    }
  }

  if (password.trim() != "") {
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
  } else {
    errors.password = "Enter a valid password";
  }

  return errors;
};

module.exports = validator;
