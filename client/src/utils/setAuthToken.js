import axios from "axios";

const setAuthToken = token => {
  // Check if token is passed
  if (token) {
    // If token is available then set it as authorization header for axios requests
    axios.defaults.headers.common["authorization"] = token;
  } else {
    // If token is not passed then set remove header from axios requests
    delete axios.defaults.headers.common["authorization"];
  }
};

export default setAuthToken;
