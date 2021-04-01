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
    UPDATE_PROFILE_DESCRIPTION,
    SET_CURRENT_PROFILE_USERNAME
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
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const getFriendRequests = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {

            const res = await axios.get(`${API}/profile/friend_requests/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIEND_REQUESTS, payload: {friendRequests: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const getFriends = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await axios.get(`${API}/profile/friends/${userId}/${profileId}`, {withCredentials: true});

            dispatch({type: FETCH_FRIENDS, payload: {friends: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const sendFriendRequest = (userId: number, profileId: number, receiverProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody({receiverProfileId});

            await axios.post(`${API}/profile/send_friend_request/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: SEND_FRIEND_REQUEST});
        } catch (err) {
            toast.error("Request couldn't be sended")
        }
    }
}

export const acceptFriendRequest = (userId: number, profileId: number, senderProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody({senderProfileId});

            await axios.post(`${API}/profile/accept_friend_request/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: ACCEPT_FRIEND_REQUEST});
        } catch (err) {
            toast.error("Request couldn't be accepted")
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

export const updateProfileDescription = (userId: number, profileId: number, description: string) => {
    return async (dispatch:Dispatch) => {
        try {
            const contentType = getContentType();
            const body = getAxiosBody({description});

            await axios.put(`${API}/profile/description/${userId}/${profileId}`, body, {...contentType, withCredentials: true});

            dispatch({type: UPDATE_PROFILE_DESCRIPTION, payload: {description}});
        } catch (err) {
            toast.error("Profile couldn't be updated");
        }
    }
}

export const setCurrentProfileUsername = (username: string | null) => {
    return {type: SET_CURRENT_PROFILE_USERNAME, payload: {username}};
}