import { REGISTER_USER, LOGIN, VERIFY_USER, LOG_OUT } from "../actionTypes/userActionTypes";
import { UserPayload, UserState } from "../interfaces/user";

const initialState: UserState = {
    user: {
        id: 0,
        username: "",
        email: ""
    },
    isAuthenticated: false
}

const userReducer = (state=initialState, action: {type: string, payload: UserPayload}) => {
    const {type, payload} = action;

    switch(type){
        case REGISTER_USER:
        case LOGIN:
            localStorage.setItem("user", JSON.stringify(payload.user));
            return {...state, user: payload.user, isAuthenticated: true}
        case VERIFY_USER:
            let user = JSON.parse(localStorage.getItem("user") + "");
            return {...state, user, isAuthenticated: true}
        case LOG_OUT:
            return initialState;
        default:
            return state;
    }
}

export default userReducer;