import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriendRequests, getFriends, getNotifications, getProfile, getSendedFriendRequests, setCurrentProfileUsername } from '../../actions/profileActions'
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

const Dashboard = () => {
    const {user} = useSelector((state:State) => state.user) 
    const {profile, showSearchingResults} = useSelector((state:State) => state.profile)
    const {showModal, modalType} = useSelector((state:State) => state.layout) 
    const dispatch = useDispatch();

    const [showSearchProfile, setShowSearchProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

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
        }
    }, [profile, dispatch])

    return (
        <div className="dashboard container">
            <React.Fragment>
                <SideNavLeft setShowSearchProfile={setShowSearchProfile} setShowNotifications={setShowNotifications}/>

                <SideNavRight/>
            </React.Fragment>

            {showModal && modalType === "post" && <CreatePost/>}

            {showModal && modalType === "comment" && <CreateComment/>}

            {showModal && modalType === "answer" && <CreateAnswer/>}

            {showSearchProfile && <SearchProfile setShowSearchProfile={setShowSearchProfile}/>}

            {showSearchingResults && <SearchedProfileResults/>}

            {!showSearchingResults && <Posts/>}

            {showNotifications && <Notifications setShowNotifications={setShowNotifications}/>}
        </div>
    )
}

export default Dashboard
