import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import postsReducer from "./postsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: usersReducer,
  posts: postsReducer
});

export default rootReducer;
