import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { setCurrentConversation, setShowConversation } from '../../actions/conversationActions';
import { setCurrentProfileUsername } from '../../actions/profileActions';
import { State } from '../../interfaces';
import { Friend } from '../../interfaces/profile'

const FriendListItem = (props: {friend: Friend}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {user} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)

    const [showOptions, setShowOptions] = useState(false);

    return (
        <li 
            className="friend" key={props.friend.id}
            onClick={() => setShowOptions(!showOptions)}
        >
            {
                showOptions &&
                <div className="options shadow">
                    <span onClick={() => {
                        setShowOptions(false);
                        dispatch(setCurrentProfileUsername(props.friend.username));
                        history.push(`/profile/${props.friend.friend_profile_id}`);
                    }}>View Profile</span>
                    <span onClick={() => {
                        dispatch(setCurrentConversation(props.friend.friend_profile_id, user.id, profile.id, props.friend.username))
                        dispatch(setShowConversation(true))
                    }}>Send Message</span>
                </div>
            }

            <span>
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/>
                <div className={props.friend.is_active === 0 ? "user-activity" : "user-activity active"}></div>
            </span>

            {props.friend.username}
        </li>
    )
}

export default FriendListItem
