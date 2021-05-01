import { 
    FETCH_FRIENDS, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_CURRENT_PROFILE,
    UPDATE_PROFILE_DESCRIPTION,
    SET_CURRENT_PROFILE_USERNAME,
    FIND_USERNAME_MATCHES,
    CLEAR_MATCHES,
    GET_SEARCHING_RESULTS,
    HIDE_SEARCHING_RESULTS,
    FETCH_SENDED_FRIEND_REQUESTS,
    SET_CAN_CLICK_REQUEST_BUTTON,
    CANCEL_FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    READ_NOTIFICATIONS,
    DELETE_NOTIFICATION
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
    sendedFriendRequests: [],
    notifications: [],
    currentProfile: {
        id: -1,
        profile_description: "",
        profile_image: "",
        posts: 0,
        friends: 0,
        status: "",
        username: null
    },
    searchResults: [],
    searchMatches: [],
    showSearchingResults: false,
    canClickRequestButton: true
};

const profileReducer = (state=initialState, action: {type:string, payload: ProfilePayload}) => {
    const {type, payload} = action;

    let profile = state.profile
    let currentProfile = state.currentProfile
    let sendedFriendRequests = state.sendedFriendRequests
    let friendRequests = state.friendRequests;
    let notifications = state.notifications;

    switch(type){
        case FETCH_PROFILE:
            return {...state, profile: payload.profile};
        case FETCH_NOTIFICATIONS:
            return {...state, notifications: payload.notifications};
        case FETCH_FRIEND_REQUESTS:
            return {...state, friendRequests: payload.friendRequests};
        case FETCH_SENDED_FRIEND_REQUESTS:
            return {...state, sendedFriendRequests: payload.sendedFriendRequests};
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
        case FIND_USERNAME_MATCHES:
            return {...state, searchMatches: payload.searchMatches}
        case CLEAR_MATCHES:
            return {...state, searchMatches: []}
        case HIDE_SEARCHING_RESULTS:
            return {...state, showSearchingResults: false}
        case GET_SEARCHING_RESULTS:
            return {...state, searchResults: payload.searchResults, showSearchingResults: true}
        case SET_CAN_CLICK_REQUEST_BUTTON:
            return {...state, canClickRequestButton: payload.canClickRequestButton}
        case CANCEL_FRIEND_REQUEST:
            sendedFriendRequests = sendedFriendRequests.filter(request => request.receiver_profile_id !== payload.receiverProfileId)
            return {...state, sendedFriendRequests}
        case ACCEPT_FRIEND_REQUEST:
            friendRequests = friendRequests.filter(request => request.sender_profile_id !== payload.senderProfileId);
            return {...state, friendRequests}
        case READ_NOTIFICATIONS:
            notifications = notifications.map(notification => {
                if(!notification.seen){
                    notification.seen = 1;
                }

                return notification;
            });

            return {...state, notifications}
        case DELETE_NOTIFICATION:
            return {...state, notifications: notifications.filter(notification => notification.id !== payload.notificationId)}
        default:
            return state;
    }
}

export default profileReducer;