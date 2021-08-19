import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentConversation, setShowConversation } from '../../actions/conversationActions';
import { openModal } from '../../actions/layoutActions';
import { updateProfile } from '../../actions/profileActions';
import { State } from '../../interfaces';
import RequestButton from './RequestButton';

const ProfileHeader = (props: {
    setShowUpdateImage: Function,
    setShowImages: Function,
}) => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user)
    const {friends, profile, currentProfile} = useSelector((state: State) => state.profile)
    const {posts} = useSelector((state: State) => state.post)
    
    const isCurrentProfile = profile.id === currentProfile.id;
    const isFriend = !isCurrentProfile && friends.find(friend => friend.friend_profile_id === currentProfile.id) ? true : false

    const [editProfile, setEditProfile] = useState(false);
    const [description, setDescription] = useState(currentProfile.profile_description);
    const [status, setStatus] = useState(currentProfile.status)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(updateProfile(user.id, profile.id, {description, status}));

        setEditProfile(false);
    }

    useEffect(() => {
        setDescription(currentProfile.profile_description);
        setStatus(currentProfile.status)
    }, [currentProfile.id])

    return (
        <div className="profile-header d-flex justify-content-center align-items-center">
            <div className="profile-header-top">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="profile-image">
                        <img src={currentProfile.id === profile.id ? profile.profile_image : currentProfile.profile_image} alt="User Default"/>

                        <ul className="image-actions">
                            {
                                isCurrentProfile && <li onClick={() => props.setShowUpdateImage(true)}>Update Image</li>
                            }
                            <li onClick={() => props.setShowImages(true)}>See Images</li>
                        </ul>
                    </div>

                    <div className="profile-details d-flex flex-column justify-content-center">
                        <span><strong>{isCurrentProfile ? user.username : currentProfile.username}</strong></span>
                        <span>{friends.length} Friends</span>
                        <span>{posts.length} Posts</span>

                        {
                            isCurrentProfile &&
                            <React.Fragment>
                                <button 
                                    className="btn btn-primary mb-3"
                                    onClick={() => {
                                        dispatch(openModal("post"))
                                    }}
                                >
                                    Create Post +
                                </button>

                                <span onClick={() => setEditProfile(!editProfile)}>Edit <i className="fas fa-edit"></i></span>
                            </React.Fragment>
                        }
                    </div>
                </div>

                <div className="description">
                    {(!editProfile || !isCurrentProfile) && <p>
                        {description}
                    </p>}

                    {
                        editProfile && isCurrentProfile && 
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <select className="form-select" defaultValue={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    className="form-control" 
                                    rows={4}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">Update</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditProfile(false)}>Cancel</button>
                        </form>
                    }
                </div>

                {!isCurrentProfile && 
                    <RequestButton profileId={currentProfile.id} />
                }

                {
                    !isCurrentProfile && isFriend &&
                    <button 
                        className="btn btn-primary send-message-btn" 
                        onClick={() => {
                            dispatch(setShowConversation(true))
                            dispatch(setCurrentConversation(currentProfile.id, user.id, profile.id, currentProfile.username))
                        }}
                    >
                        Send Message <i className="fas fa-inbox"></i>
                    </button>
                }
            </div>
        </div>
    )
}

export default ProfileHeader
