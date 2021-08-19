import { 
    FETCH_FRIENDS, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_CURRENT_PROFILE,
    UPDATE_PROFILE,
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
    DELETE_NOTIFICATION,
    GET_NEW_NOTIFICATIONS,
    CHANGE_USER_ACTIVITY,
    UPDATE_FRIENDS_ACTIVITY,
    FETCH_PROFILE_IMAGES,
    DELETE_IMAGE,
    UPDATE_PROFILE_IMAGE
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
        username: null,
        is_active: 0
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
        username: null,
        is_active: 0
    },
    searchResults: [],
    searchMatches: [],
    showSearchingResults: false,
    canClickRequestButton: true,
    profileImages: []
};

const profileReducer = (state=initialState, action: {type:string, payload: ProfilePayload}) => {
    const {type, payload} = action;

    let profile = state.profile
    let currentProfile = state.currentProfile
    let sendedFriendRequests = state.sendedFriendRequests
    let friendRequests = state.friendRequests;
    let notifications = state.notifications;
    let friends = state.friends;
    let profileImages = state.profileImages

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
        case UPDATE_PROFILE:
            profile.profile_description = payload.description
            profile.status = payload.status;
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
        case GET_NEW_NOTIFICATIONS:
            let newNotifications = [...notifications]
            payload.notifications.forEach(notification => {
                let notif = newNotifications.find(n => n.id === notification.id);

                if(notif){
                    notif.notification = notification.notification;
                }else{
                    newNotifications.unshift(notification)
                }
            })

            return {...state, notifications: newNotifications}
        case CHANGE_USER_ACTIVITY:
            profile.is_active = payload.isActive;
            return {...state, profile}
        case UPDATE_FRIENDS_ACTIVITY:
            payload.changedFriendsActivity.forEach(changedActivity => {
                friends[changedActivity.index].is_active = changedActivity.is_active;
            })

            return {...state, friends}
        case UPDATE_PROFILE_IMAGE:
            profile.profile_image = payload.profile_image;
            
            const profileImage = {id: Date.now(), image_path: payload.profile_image};
            profileImages.push(profileImage)

            return {...state, profile, profileImages};
        case FETCH_PROFILE_IMAGES:
            return {...state, profileImages: payload.profileImages}
        case DELETE_IMAGE:
            profile.profile_image = payload.profile_image;

            profileImages.splice(payload.currentImage, 1)

            return {...state, profile, profileImages}
        default:
            return state;
    }
}

export default profileReducer;