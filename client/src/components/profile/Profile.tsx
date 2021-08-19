import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '../post/Posts'
import {State} from '../../interfaces'
import { fetchCurrentProfile, fetchCurrentProfilePosts, fetchProfileImages } from '../../actions/profileActions'
import CreateComment from '../modals/CreateComment'
import CreateAnswer from '../modals/CreateAnswer'
import CreatePost from '../modals/CreatePost'
import Conversation from '../messages/Conversation'
import ProfileImages from './ProfileImages'
import UpdateProfileImage from './UpdateProfileImage'
import ProfileHeader from './ProfileHeader'

const Profile = () => {
    const dispatch = useDispatch();
    const {user} = useSelector((state:State) => state.user)
    const {loading} = useSelector((state: State) => state.post);
    const { profile, currentProfile } = useSelector((state:State) => state.profile)
    const {showConversation} = useSelector((state: State) => state.conversation);

    const {showModal, modalType} = useSelector((state:State) => state.layout) 

    const [showImages, setShowImages] = useState(false);
    const [showUpdateImage, setShowUpdateImage] = useState(false)

    useEffect(() => {
        let href = window.location.href.split("/");
        let profileId = parseInt(href[href.length - 1]);

        dispatch(fetchCurrentProfile(user.id, profile.id, profileId));
        dispatch(fetchCurrentProfilePosts(user.id, profile.id, profileId));
    }, [])

    useEffect(() => {
        if(currentProfile.id > 0){
            dispatch(fetchProfileImages(user.id, profile.id, currentProfile.id))
        }
    }, [currentProfile.id])

    return (
        <div className="profile">
            {loading && <div className="d-flex justify-content-center align-items-center loading pt-4">
                <div className="spinner-border" role="status">
                </div>
                <span>Loading...</span>
            </div>}

            {!loading && <div className="container">
                {
                    <ProfileHeader setShowImages={setShowImages} setShowUpdateImage={setShowUpdateImage} />
                }

                {
                    showImages &&
                    <ProfileImages setShowImages={setShowImages} />
                }

                {
                    showUpdateImage &&
                    <UpdateProfileImage setShowUpdateImage={setShowUpdateImage} />
                }

                <Posts/>

                {showModal && modalType === "post" && <CreatePost/>}

                {showModal && modalType === "comment" && <CreateComment/>}

                {showModal && modalType === "answer" && <CreateAnswer/>}
            </div>}

            {showConversation && <Conversation/>}
        </div>
    )
}

export default Profile
