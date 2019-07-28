import jwtDecode from "jwt-decode";

const authentication = {};

authentication.isLoggedIn = () => {
  const token = localStorage.getItem("user");

  if (token) {
    const decoded = jwtDecode(token);
    var currentTime = Date.now().toString();
    currentTime = currentTime.substring(0, currentTime.length - 3);
    const currentTimeNum = parseInt(currentTime);
    if (currentTimeNum > decoded.exp) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export default authentication;
