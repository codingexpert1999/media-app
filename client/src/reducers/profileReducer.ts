import { 
    FETCH_FRIENDS, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_CURRENT_PROFILE,
    UPDATE_PROFILE_DESCRIPTION,
    SET_CURRENT_PROFILE_USERNAME
} from "../actionTypes/profileActionTypes";
import { LOG_OUT } from "../actionTypes/userActionTypes";
import { ProfilePayload, ProfileState } from "../interfaces/profile";

const initialState: ProfileState = {
    profile: {
        id: 0,
        profile_description: "",
        profile_image: "",
        posts: 0,
        friends: 0,
        status: "",
        username: null
    },
    friends: [],
    friendRequests: [],
    notifications: [],
    currentProfile: {
        id: -1,
        profile_description: "",
        profile_image: "",
        posts: 0,
        friends: 0,
        status: "",
        username: null
    }
};

const profileReducer = (state=initialState, action: {type:string, payload: ProfilePayload}) => {
    const {type, payload} = action;

    let profile = state.profile
    let currentProfile = state.currentProfile

    switch(type){
        case FETCH_PROFILE:
            return {...state, profile: payload.profile};
        case FETCH_NOTIFICATIONS:
            return {...state, notifications: payload.notifications};
        case FETCH_FRIEND_REQUESTS:
            return {...state, friendRequests: payload.friendRequests};
        case FETCH_FRIENDS:
            return {...state, friends: payload.friends};
        case FETCH_CURRENT_PROFILE:
            currentProfile = {...currentProfile, ...payload.profile};
            return {...state, currentProfile};
        case UPDATE_PROFILE_DESCRIPTION:
            profile.profile_description = payload.description
            return {...state, profile};
        case SET_CURRENT_PROFILE_USERNAME:
            currentProfile.username = payload.username;
            return {...state, currentProfile}
        case LOG_OUT:
            return initialState;
        default:
            return state;
    }
}

export default profileReducer;