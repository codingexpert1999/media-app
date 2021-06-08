import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentConversation, setShowConversation } from '../../../actions/conversationActions'
import { closeModal } from '../../../actions/layoutActions'
import { State } from '../../../interfaces'
import { Message as MessageObj } from '../../../interfaces/conversation'

const Message = (props: {message: MessageObj; friendProfileId: number;}) => {
    const dispatch = useDispatch()

    const {user} = useSelector((state: State) => state.user)
    const {profile, friends} = useSelector((state: State) => state.profile)

    const friend = friends.find(friend => friend.friend_profile_id === props.friendProfileId)!;

    return (
        <li className="message" onClick={() => {
            dispatch(closeModal());
            dispatch(setCurrentConversation(friend.friend_profile_id, user.id, profile.id, friend.username));
            dispatch(setShowConversation(true))
        }}>
            <div className="user">
                <img src="/assets/user.png" alt="User Default" />
                <span>{friend.username}</span>
                <div className={ friend.is_active === 1 ? "user-activity active" : "user-activity"}></div>
            </div>

            <p className={props.message.seen === 1 ? "seen" : ""}>{props.message.message}</p>
        </li>
    )
}

export default Message
