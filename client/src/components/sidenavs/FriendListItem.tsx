import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { setShowConversation } from '../../actions/conversationActions';
import { setCurrentProfileUsername } from '../../actions/profileActions';
import { Friend } from '../../interfaces/profile'

const FriendListItem = (props: {friend: Friend}) => {
    const dispatch = useDispatch();
    const history = useHistory();

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
                    <span onClick={() => dispatch(setShowConversation(true))}>Send Message</span>
                </div>
            }

            <span>
                <img src="/assets/user.png" className="img-fluid" alt="Default User"/>
                <div className="user-activity"></div>
            </span>

            {props.friend.username}
        </li>
    )
}

export default FriendListItem
