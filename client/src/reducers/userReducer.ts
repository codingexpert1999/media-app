import { REGISTER_USER, LOGIN } from "../actionTypes/userActionTypes";
import { UserPayload, UserState } from "../interfaces/user";

const initialState:UserState = {
    user: {
        username: "john doe",
        email: "john@gmail.com"
    },
    token: "test123",
    isAuthenticated: true
}

const userReducer = (state=initialState, action: {type: string, payload: UserPayload}) => {
    const {type, payload} = action;

    switch(type){
        case REGISTER_USER:
        case LOGIN:
            return {...state, user: payload.user, token: payload.token, isAuthenticated: true}
        default:
            return state;
    }
}

export default userReducer;