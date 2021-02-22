import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriendRequests, getFriends, getNotifications, getProfile } from '../../actions/profileActions'
import CreatePost from '../modals/CreatePost'
import Posts from '../post/Posts'
import SideNavLeft from '../sidenavs/SideNavLeft'
import SideNavRight from '../sidenavs/SideNavRight'
import {State} from '../../interfaces'
import { fetchPosts, getAllLikes } from '../../actions/postActions'
import CreateComment from '../modals/CreateComment'
import CreateAnswer from '../modals/CreateAnswer'

const Dashboard = () => {
    const {token, user} = useSelector((state:State) => state.user) 
    const {profile} = useSelector((state:State) => state.profile)
    const {showModal, modalType} = useSelector((state:State) => state.layout) 
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile(token, user.id));
    }, [])

    useEffect(() => {
        if(profile.id !== 0){
            dispatch(getAllLikes(token, user.id, profile.id));
            dispatch(fetchPosts(token, user.id, profile.id));
            dispatch(getFriends(token, user.id, profile.id));
            dispatch(getFriendRequests(token, user.id, profile.id));
            dispatch(getNotifications(token, user.id, profile.id));
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

            <Posts/>
        </div>
    )
}

export default Dashboard
