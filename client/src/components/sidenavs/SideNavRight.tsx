import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../interfaces'
import FriendListItem from './FriendListItem';

const SideNavRight = () => {
    const {friends} = useSelector((state: State) => state.profile);

    return (
        <ul className="sidenav sidenav-right shadow">
            <h4 className="border-bottom">Friends <i className="fas fa-user-friends"></i></h4>

            <ul className="friends">
                {friends.map(friend => (
                    <FriendListItem key={friend.id} friend={friend} />
                ))}
            </ul>
        </ul>
    )
}

export default SideNavRight
