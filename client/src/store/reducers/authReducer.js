const initialState = {
  user: {},
  isAuthenticated: false,
  token: "",
  errors: {
    loginId: "",
    loginPassword: "",
    email: "",
    username: "",
    password: "",
    password2: "",
    bio: ""
  }
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        token: action.payload.token
      };
    case "LOGOUT_USER":
      return initialState;
    case "GET_ERRORS":
      console.log(action.payload);
      return {
        ...state,
        errors: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
