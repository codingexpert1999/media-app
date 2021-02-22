import {combineReducers} from "redux";
import layoutReducer from "./layoutReducer";
import postReducer from "./postReducer";
import profileReducer from "./profileReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    layout: layoutReducer,
    user: userReducer,
    profile: profileReducer,
    post: postReducer
});

export default rootReducer;