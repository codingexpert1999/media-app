import {Dispatch} from 'redux'
import {toast} from 'react-toastify';
import {API, getAxiosBody, getContentType} from '../helper'
import axios from 'axios';
import { 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_FRIENDS, 
    SEND_FRIEND_REQUEST, 
    ACCEPT_FRIEND_REQUEST,
    FETCH_CURRENT_PROFILE,
    FETCH_CURRENT_PROFILE_POSTS,
    UPDATE_PROFILE,
    SET_CURRENT_PROFILE_USERNAME,
    FIND_USERNAME_MATCHES,
    CLEAR_MATCHES,
    HIDE_SEARCHING_RESULTS,
    GET_SEARCHING_RESULTS,
    FETCH_SENDED_FRIEND_REQUESTS,
    SET_CAN_CLICK_REQUEST_BUTTON,
    CANCEL_FRIEND_REQUEST,
    REMOVE_FRIEND,
    READ_NOTIFICATIONS,
    DELETE_NOTIFICATION,
    CHANGE_USER_ACTIVITY,
    FETCH_PROFILE_IMAGES,
    DELETE_IMAGE,
    UPDATE_PROFILE_IMAGE,
} from '../actionTypes/profileActionTypes';
import { POSTS_LOADING } from '../actionTypes/postActionTypes';

export const getProfile = (userId: number) => {
    return async (dispatch: Dispatch) => {
        try {

            const res = await axios.get(`${API}/profile/${userId}`, {withCredentials: true});

            dispatch({type: FETCH_PROFILE, payload: {profile: res.data}});
        } catch (err) {
            toast.error("Profile couldn't be fetched")
        }
    }
}

export const getNotifications = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await axios.get(`${API}/profile/notifications/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_NOTIFICATIONS, payload: {notifications: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched!")
        }
    }
}

export const getFriendRequests = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {

            const res = await axios.get(`${API}/profile/friend_requests/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIEND_REQUESTS, payload: {friendRequests: res.data}});
        } catch (err) {
            toast.error("Friend requests couldn't be fetched")
        }
    }
}

export const getSendedFriendRequests = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {

            const res = await axios.get(`${API}/profile/sended_friend_requests/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_SENDED_FRIEND_REQUESTS, payload: {sendedFriendRequests: res.data}});
        } catch (err) {
            toast.error("Sended friend requests couldn't be fetched")
        }
    }
}

export const getFriends = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await axios.get(`${API}/profile/friends/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIENDS, payload: {friends: res.data}});
        } catch (err) {
            toast.error("Friends couldn't be fetched")
        }
    }
}

export const sendFriendRequest = (userId: number, profileId: number, receiverProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch(setCanClickRequestButton(false));

            await axios.post(`${API}/profile/send_friend_request/${receiverProfileId}/${userId}/${profileId}`, null, {withCredentials: true});

            dispatch({type: SEND_FRIEND_REQUEST});

            const res = await axios.get(`${API}/profile/sended_friend_requests/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_SENDED_FRIEND_REQUESTS, payload: {sendedFriendRequests: res.data}});

        } catch (err) {
            toast.error("Request couldn't be sended")
        }finally{
            dispatch(setCanClickRequestButton(true));
        }
    }
}

export const acceptFriendRequest = (userId: number, profileId: number, senderProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch(setCanClickRequestButton(false));

            await axios.post(`${API}/profile/accept_friend_request/${senderProfileId}/${userId}/${profileId}`, null, {withCredentials: true});

            dispatch({type: ACCEPT_FRIEND_REQUEST, payload: {senderProfileId}});

            const res = await axios.get(`${API}/profile/friends/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIENDS, payload: {friends: res.data}});
        } catch (err) {
            toast.error("Request couldn't be accepted")
        }finally{
            dispatch(setCanClickRequestButton(true));
        }
    }
}

export const cancelFriendRequest = (userId: number, profileId: number, receiverProfileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setCanClickRequestButton(false));

            await axios.delete(`${API}/profile/friend_request/${receiverProfileId}/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: CANCEL_FRIEND_REQUEST, payload: {receiverProfileId}})
        } catch (err) {
            toast.error("Request couldn't be canceled");
        }finally{
            dispatch(setCanClickRequestButton(true));
        }
    }
}

export const fetchCurrentProfile = (userId: number, profileId: number, currentProfile: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const res = await axios.get(`${API}/profile/${currentProfile}/${userId}/${profileId}`, {withCredentials: true})

            dispatch({type: FETCH_CURRENT_PROFILE, payload: res.data});
        } catch (err) {
            toast.error("Profile couldn't be fetched");
        }
    }
}

export const fetchCurrentProfilePosts = (userId: number, profileId: number, currentProfile: number) => {
    return async (dispatch:Dispatch) => {
        try {
            dispatch({type: POSTS_LOADING});
            
            const res = await axios.get(`${API}/profile/${currentProfile}/posts/${userId}/${profileId}`, {withCredentials: true})

            dispatch({type: FETCH_CURRENT_PROFILE_POSTS, payload: {posts: res.data}});
        } catch (err) {
            toast.error("Profile posts couldn't be fetched");
        }
    }
}

export const updateProfile = (userId: number, profileId: number, formData: Object) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody(formData);

            await axios.put(`${API}/profile/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: UPDATE_PROFILE, payload: formData});
        } catch (err) {
            toast.error("Profile couldn't be updated");
        }
    }
}

export const setCurrentProfileUsername = (username: string | null) => {
    return {type: SET_CURRENT_PROFILE_USERNAME, payload: {username}};
}

export const findUsernameMatches = (userId: number, profileId: number, firstLetter: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const body = getAxiosBody({firstLetter});
            const contentType = getContentType();

            const res = await axios.post(`${API}/profile/search_profile/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: FIND_USERNAME_MATCHES, payload: {searchMatches: res.data}});
        } catch (err) {
            toast.error("Matches couldn't be found");
        }
    }
}

export const clearMatches = () => {
    return {type: CLEAR_MATCHES}
}

export const hideSearchedResults = () => {
    return {type: HIDE_SEARCHING_RESULTS}
}

export const getSearchingResults = (userId: number, profileId: number, username: string) => {
    return async (dispatch:Dispatch) => {
        try {
            const body = getAxiosBody({username});
            const contentType = getContentType();

            const res = await axios.post(`${API}/profile/get_searching_results/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: GET_SEARCHING_RESULTS, payload: {searchResults: res.data}});
        } catch (err) {
            toast.error("Something went wrong in profile searching!")
        }
    }
}

export const setCanClickRequestButton = (canClickRequestButton: boolean) => {
    return {type: SET_CAN_CLICK_REQUEST_BUTTON, payload: {canClickRequestButton}}
}

export const removeFriend = (userId: number, profileId: number, friendshipId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setCanClickRequestButton(false));

            await axios.delete(`${API}/profile/friend/${friendshipId}/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: REMOVE_FRIEND, payload: {friendshipId}})

            const res = await axios.get(`${API}/profile/friends/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIENDS, payload: {friends: res.data}});
        } catch (err) {
            toast.error("Friend couldn't be removed");
        }finally{
            dispatch(setCanClickRequestButton(true));
        }
    }
}

export const readNotifications = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.put(`${API}/profile/notifications/${userId}/${profileId}`, null, {withCredentials: true});

            dispatch({type: READ_NOTIFICATIONS});
        } catch (err) {
            toast.error("Notifications couldn't be updated!")
        }
    }
}

export const deleteNotification = (userId: number, profileId: number, notificationId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.delete(`${API}/profile/notifications/${notificationId}/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: DELETE_NOTIFICATION, payload: {notificationId}});
        } catch (err) {
            toast.error("Notifications couldn't be updated!")
        }
    }
}

export const changeUserActivity = (userId: number, profileId: number, isActive: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody({isActive});

            await axios.put(`${API}/profile/change_activity/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: CHANGE_USER_ACTIVITY, payload: {isActive}});
        } catch (er) {
            toast.error("User activity couldn't be changed");
        }
    }
}

export const updateProfileImage = (userId: number, profileId: number, formData: FormData) => {
    return async (dispatch: Dispatch) => {
        const contentType = {
            'Content-Type': "multipart/form-data"
        }

        try {
            const res = await axios.put(`${API}/profile/image/${userId}/${profileId}`, formData, {...contentType, withCredentials: true});

            dispatch({type: UPDATE_PROFILE_IMAGE, payload: res.data});
        } catch (err) {
            toast.error("Profile image couldn't be uploaded");
        }
    }
}

export const fetchProfileImages = (userId: number, profileId: number, currentProfile: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await axios.get(`${API}/profile/${currentProfile}/images/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_PROFILE_IMAGES, payload: {profileImages: res.data}});
        } catch (err) {
            toast.error("Profile images couldn't be fetched!")
        }
    }
}

export const deleteImage = (userId: number, profileId: number, image: string, currentImage: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const contentType = getContentType()
            const body = getAxiosBody({image})

            const res = await axios.post(`${API}/profile/delete_image/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: DELETE_IMAGE, payload: {...res.data, currentImage}});
        } catch (err) {
            toast.error("Image couldn't be deleted!")
        }
    }
}