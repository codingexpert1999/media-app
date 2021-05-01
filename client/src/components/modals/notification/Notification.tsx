import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, deleteNotification } from '../../../actions/profileActions';
import { DELETE_NOTIFICATION } from '../../../actionTypes/profileActionTypes';
import { State } from '../../../interfaces';
import { Notification as Notif } from '../../../interfaces/profile'

const Notification = (props: {notification: Notif}) => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user)
    const {profile} = useSelector((state: State) => state.profile)

    let notification = props.notification.notification.split(" ");
    const username = notification[0];
    const notificationMessage = notification.reduce((acc, word, i) => {
        if(i !== 0){
            acc += word;

            if(i !== notification.length){
                acc += " "
            }

            return acc;
        }else{
            return acc;
        }
    }, "");

    const [isSeen, setIsSeen] = useState(false);

    useEffect(() => {
        if(props.notification.seen === 1){
            setIsSeen(true)
        }
    }, [])

    return (
        <div className={isSeen ? "notification seen" : "notification"}>
            <img src={props.notification.profile_image} alt="user Default"/>

            <div className="notification-message">
                <p><strong>{username}</strong> {notificationMessage}</p>

                {
                    props.notification.notification_type === "friend_request" && 
                    <button 
                        className="btn btn-success" 
                        onClick={() => {
                            dispatch(acceptFriendRequest(user.id, profile.id, props.notification.sender_profile_id))
                            dispatch({type: DELETE_NOTIFICATION, payload: {notificationId: props.notification.id}})
                        }}
                    >
                        Accept Friend Request
                    </button>
                }

                <div 
                    className="delete-notification" 
                    onClick={() => dispatch(deleteNotification(user.id, profile.id, props.notification.id))}
                ></div>
            </div>
        </div>
    )
}

export default Notification
