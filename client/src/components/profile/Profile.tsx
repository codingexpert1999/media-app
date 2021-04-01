import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '../post/Posts'
import {State} from '../../interfaces'
import { fetchCurrentProfile, fetchCurrentProfilePosts, updateProfileDescription } from '../../actions/profileActions'

const Profile = () => {
    const dispatch = useDispatch();
    const {user} = useSelector((state:State) => state.user)
    const {loading} = useSelector((state: State) => state.post);
    const {profile, currentProfile, friends} = useSelector((state:State) => state.profile)
    
    const [description, setDescription] = useState(currentProfile.profile_description);
    const [editProfile, setEditProfile] = useState(false);

    const isCurrentProfile = profile.id === currentProfile.id;
    const isFriend = friends.find(friend => friend.friend_profile_id === currentProfile.id) ? true : false;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(updateProfileDescription(user.id, profile.id, description));

        setEditProfile(false);
    }

    useEffect(() => {
        let href = window.location.href.split("/");
        let profileId = parseInt(href[href.length - 1]);

        dispatch(fetchCurrentProfile(user.id, profile.id, profileId));
        dispatch(fetchCurrentProfilePosts(user.id, profile.id, profileId));
    }, [])

    useEffect(() => {
        setDescription(currentProfile.profile_description);
    }, [currentProfile.id])

    return (
        <div className="profile">
            {loading && <div className="d-flex justify-content-center align-items-center loading pt-4">
                <div className="spinner-border" role="status">
                </div>
                <span>Loading...</span>
            </div>}

            {!loading && <div className="container">
                <div className="profile-header d-flex justify-content-center align-items-center">
                    <div className="profile-header-top">
                        <div className="d-flex justify-content-center align-items-center">
                            <img src={currentProfile.profile_image} alt="User Default"/>

                            <div className="profile-details d-flex flex-column justify-content-center">
                                <span><strong>{isCurrentProfile ? user.username : currentProfile.username}</strong></span>
                                <span>712 Friends</span>
                                <span>32 Posts</span>
                                {
                                    isCurrentProfile &&
                                    <span onClick={() => setEditProfile(!editProfile)}>Edit <i className="fas fa-edit"></i></span>
                                }
                            </div>
                        </div>

                        <div className="description">
                            {(!editProfile || !isCurrentProfile) && <p>
                                {description}
                            </p>}

                            {editProfile && isCurrentProfile && <form onSubmit={handleSubmit}>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    className="form-control" 
                                    rows={4}
                                ></textarea>

                                <button type="submit" className="btn btn-primary">Update</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditProfile(false)}>Cancel</button>
                            </form>}
                        </div>

                        {!isCurrentProfile && 
                            <button 
                                className={isFriend ? "btn btn-danger" : "btn btn-success"}
                            >
                                {isFriend ? "Remove Friend" : "Send Friend Request"}
                            </button>
                        }
                    </div>
                </div>

                <Posts/>
            </div>}
        </div>
    )
}

export default Profile
