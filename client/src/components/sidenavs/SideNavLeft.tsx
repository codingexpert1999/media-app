import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '../../actions/layoutActions';
import { clearMatches } from '../../actions/profileActions';
import { State } from '../../interfaces';

const SideNavLeft = () => {
    const dispatch = useDispatch();

    const {notifications} = useSelector((state:State) => state.profile);
    const {modalType} = useSelector((state:State) => state.layout);
    const {convos} = useSelector((state:State) => state.conversation);
    const {profile} = useSelector((state: State) => state.profile);

    const [unseenNotifications, setUnseenNotifications] = useState(notifications.filter(notification => notification.seen === 0).length)
    const [unseenMessages, setUnseenMessages] = useState(
        convos.filter(
            convo => convo.lastMessage.seen === 0 && convo.lastMessage.profile_id !== profile.id
        ).length
    )

    useEffect(() => {
        setUnseenNotifications(notifications.filter(notification => notification.seen === 0).length)
    }, [notifications])

    useEffect(() => {
        setUnseenMessages(
            convos.filter(
                convo => convo.lastMessage.seen === 0 && convo.lastMessage.profile_id !== profile.id
            ).length
        )
    }, [convos])

    return (
        <ul className="sidenav sidenav-left shadow">
            <li>
                <button className="btn btn-primary" onClick={() => {
                    if(modalType !== ""){
                        return;
                    }
                    
                    dispatch(openModal("post"))
                }}>Create Post +</button>
            </li>
            <li>
                <button className="btn btn-search-profile btn-outline-success" onClick={() => {
                    dispatch(clearMatches())
                    dispatch(openModal('search-profile'))
                }}>
                    Search Profile
                </button>
            </li>
            <li 
                className="clickable" 
                onClick={() => dispatch(openModal("notifications"))}
            >
                Notifications <i className="fas fa-bell"></i> {unseenNotifications > 0 && <span>{unseenNotifications}</span>}
            </li>
            <li 
                className="clickable"
                onClick={() => dispatch(openModal("messages"))}
            >
                Messages <i className="fas fa-inbox"></i> {unseenMessages > 0 && <span>{unseenMessages}</span>}
            </li>
        </ul>
    )
}

export default SideNavLeft
