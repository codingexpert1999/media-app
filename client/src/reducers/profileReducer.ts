import { FETCH_FRIENDS, FETCH_FRIEND_REQUESTS, FETCH_NOTIFICATIONS, FETCH_PROFILE } from "../actionTypes/profileActionTypes";
import { ProfilePayload, ProfileState } from "../interfaces/profile";

const initialState: ProfileState = {
    profile: {
        id: 0,
        profile_description: "",
        profile_image: "",
        posts: 0,
        friends: 0,
        status: ""
    },
    friends: [],
    friendRequests: [],
    notifications: []
};

const profileReducer = (state=initialState, action: {type:string, payload: ProfilePayload}) => {
    const {type, payload} = action;

    switch(type){
        case FETCH_PROFILE:
            return {...state, profile: payload.profile};
        case FETCH_NOTIFICATIONS:
            return {...state, notifications: payload.notifications};
        case FETCH_FRIEND_REQUESTS:
            return {...state, friendRequests: payload.friendRequests};
        case FETCH_FRIENDS:
            return {...state, friends: payload.friends};
        default:
            return state;
    }
}

export default profileReducer;