import {combineReducers} from "redux";
import layoutReducer from "./layoutReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    layout: layoutReducer,
    user: userReducer
});

export default rootReducer;