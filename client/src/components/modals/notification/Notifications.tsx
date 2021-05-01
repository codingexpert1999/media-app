import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readNotifications } from '../../../actions/profileActions'
import { State } from '../../../interfaces'
import Notification from './Notification'

const Notifications = (props: {setShowNotifications: Function}) => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user);
    const {notifications, profile} = useSelector((state: State) => state.profile);

    const [myNotifications, setMyNotifications] = useState(notifications)

    useEffect(() => {
        dispatch(readNotifications(user.id, profile.id));
    }, [])

    useEffect(() => {
        if(notifications.length < myNotifications.length){
            setMyNotifications(notifications);
        }
    }, [notifications])

    return (
        <div className="modal notifications">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Notifications</h5>
                        <button type="button" className="btn-close" onClick={() => props.setShowNotifications(false)}></button>
                    </div>

                    <div className="modal-body">
                        {myNotifications.map(notification => (
                            <Notification key={notification.id} notification={notification} />
                        ))}

                        {
                            myNotifications.length === 0 && <p className="no-notifications">You Have 0 Notifications</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications
