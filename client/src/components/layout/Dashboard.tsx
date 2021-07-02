import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
    changeUserActivity, 
    getFriendRequests, 
    getFriends, 
    getNotifications, 
    getProfile, 
    getSendedFriendRequests, 
    setCurrentProfileUsername
} from '../../actions/profileActions'
import CreatePost from '../modals/CreatePost'
import Posts from '../post/Posts'
import SideNavLeft from '../sidenavs/SideNavLeft'
import SideNavRight from '../sidenavs/SideNavRight'
import {State} from '../../interfaces'
import { fetchPosts, getAllLikes } from '../../actions/postActions'
import CreateComment from '../modals/CreateComment'
import CreateAnswer from '../modals/CreateAnswer'
import SearchProfile from '../modals/SearchProfile'
import SearchedProfileResults from '../profile/SearchedProfileResults'
import Notifications from '../modals/notification/Notifications'
import axios from 'axios'
import { API } from '../../helper'
import { toast } from 'react-toastify'
import { GET_NEW_NOTIFICATIONS, UPDATE_FRIENDS_ACTIVITY } from '../../actionTypes/profileActionTypes'
import Conversation from '../messages/Conversation'
import Messages from '../modals/messages/Messages'
import { getConversations } from '../../actions/conversationActions'

const Dashboard = () => {
    const {user} = useSelector((state:State) => state.user) 
    const {profile, showSearchingResults} = useSelector((state:State) => state.profile)
    const {showModal, modalType} = useSelector((state:State) => state.layout)
    const {showConversation} = useSelector((state: State) => state.conversation) 

    const dispatch = useDispatch();

    const checkForNewNotifications = () => {
        axios
        .get(`${API}/profile/new_notifications/${user.id}/${profile.id}`, {withCredentials: true})
        .then(res => {
            if(!res.data.message){
                dispatch({type: GET_NEW_NOTIFICATIONS, payload: {notifications: res.data}})
            }

            checkForNewNotifications();
        })
        .catch(err => {
            toast.error(err.message)
            checkForNewNotifications()
        })
    }

    const checkForFriendsChangeInActivity = () => {
        axios
        .get(`${API}/profile/friends/change_in_activity/${user.id}/${profile.id}`, {withCredentials: true})
        .then(res => {
            if(!res.data.message){
                dispatch({type: UPDATE_FRIENDS_ACTIVITY, payload: {changedFriendsActivity: res.data}});
            }

            checkForFriendsChangeInActivity()
        })
        .catch(err => {
            toast.error(err.message);
            checkForFriendsChangeInActivity()
        })
    }

    useEffect(() => {
        dispatch(getProfile(user.id));
        dispatch(setCurrentProfileUsername(null));
    }, [])

    useEffect(() => {
        if(profile.id !== 0){
            dispatch(getAllLikes(user.id, profile.id));
            dispatch(fetchPosts(user.id, profile.id));
            dispatch(getFriends(user.id, profile.id));
            dispatch(getFriendRequests(user.id, profile.id));
            dispatch(getSendedFriendRequests(user.id, profile.id));
            dispatch(getNotifications(user.id, profile.id));
            dispatch(changeUserActivity(user.id, profile.id, 1));
            dispatch(getConversations(user.id, profile.id))

            // checkForNewNotifications()
            // checkForFriendsChangeInActivity()
        }
    }, [profile, dispatch])

    return (
        <div className="dashboard container">
            <React.Fragment>
                <SideNavLeft/>

                <SideNavRight/>
            </React.Fragment>

            {showModal && modalType === "post" && <CreatePost/>}

            {showModal && modalType === "comment" && <CreateComment/>}

            {showModal && modalType === "answer" && <CreateAnswer/>}

            {showModal && modalType === "search-profile" && <SearchProfile />}

            {showModal && modalType === "notifications" && <Notifications/>}

            {showModal && modalType === "messages" && <Messages/>}

            {showSearchingResults && <SearchedProfileResults/>}

            {!showSearchingResults && <Posts/>}

            {showConversation && <Conversation />}
        </div>
    )
}

export default Dashboard
