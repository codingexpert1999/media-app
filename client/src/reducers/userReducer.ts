import { REGISTER_USER, LOGIN, LOAD_USER } from "../actionTypes/userActionTypes";
import { UserPayload, UserState } from "../interfaces/user";

const initialState: UserState = {
    user: {
        id: 0,
        username: "",
        email: ""
    },
    token: "",
    isAuthenticated: false
}

const userReducer = (state=initialState, action: {type: string, payload: UserPayload}) => {
    const {type, payload} = action;

    switch(type){
        case REGISTER_USER:
        case LOGIN:
            localStorage.setItem("user", JSON.stringify(payload.user));
            localStorage.setItem("token", JSON.stringify(payload.token));
            return {...state, user: payload.user, token: payload.token, isAuthenticated: true}
        case LOAD_USER:
            let user = JSON.parse(localStorage.getItem("user") + "");
            let token = JSON.parse(localStorage.getItem("token") + "");
            return {...state, user, token, isAuthenticated: true}
        default:
            return state;
    }
}

export default userReducer;