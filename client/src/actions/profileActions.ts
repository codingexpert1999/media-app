import {Dispatch} from 'redux'
import {toast} from 'react-toastify';
import {API, getAxiosBody, getAxiosConfig} from '../helper'
import axios from 'axios';
import { 
    FETCH_NOTIFICATIONS, 
    FETCH_PROFILE, 
    FETCH_FRIEND_REQUESTS, 
    FETCH_FRIENDS, 
    SEND_FRIEND_REQUEST, 
    ACCEPT_FRIEND_REQUEST 
} from '../actionTypes/profileActionTypes';

export const getProfile = (token: string, userId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const config = getAxiosConfig(token);

            const res = await axios.get(`${API}/profile/${userId}`, config);

            dispatch({type: FETCH_PROFILE, payload: {profile: res.data}});
        } catch (err) {
            toast.error("Profile couldn't be fetched")
        }
    }
}

export const getNotifications = (token: string, userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const config = getAxiosConfig(token);

            const res = await axios.get(`${API}/profile/notifications/${userId}/${profileId}`, config);

            dispatch({type: FETCH_NOTIFICATIONS, payload: {notifications: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const getFriendRequests = (token: string, userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const config = getAxiosConfig(token);

            const res = await axios.get(`${API}/profile/friend_requests/${userId}/${profileId}`, config);

            dispatch({type: FETCH_FRIEND_REQUESTS, payload: {friendRequests: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const getFriends = (token: string, userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const config = getAxiosConfig(token);

            const res = await axios.get(`${API}/profile/friends/${userId}/${profileId}`, config);

            dispatch({type: FETCH_FRIENDS, payload: {friends: res.data}});
        } catch (err) {
            toast.error("Notifications couldn't be fetched")
        }
    }
}

export const sendFriendRequest = (token: string, userId: number, profileId: number, receiverProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({receiverProfileId});

            await axios.post(`${API}/profile/send_friend_request/${userId}/${profileId}`, body, config);

            dispatch({type: SEND_FRIEND_REQUEST});
        } catch (err) {
            toast.error("Request couldn't be sended")
        }
    }
}

export const acceptFriendRequest = (token: string, userId: number, profileId: number, senderProfileId: number) => {
    return async (dispatch:Dispatch) => {
        try {
            const config = getAxiosConfig(token);
            const body = getAxiosBody({senderProfileId});

            await axios.post(`${API}/profile/accept_friend_request/${userId}/${profileId}`, body, config);

            dispatch({type: ACCEPT_FRIEND_REQUEST});
        } catch (err) {
            toast.error("Request couldn't be accepted")
        }
    }
}