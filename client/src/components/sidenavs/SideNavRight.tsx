import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router';
import { setCurrentProfileUsername } from '../../actions/profileActions';
import { State } from '../../interfaces'

const SideNavRight = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {friends} = useSelector((state: State) => state.profile);

    return (
        <ul className="sidenav sidenav-right shadow">
            <h4 className="border-bottom">Friends <i className="fas fa-user-friends"></i></h4>

            <ul className="friends">
                {friends.map(friend => (
                    <li 
                        className="friend" key={friend.id} 
                        onClick={() => {
                            dispatch(setCurrentProfileUsername(friend.username))
                            history.push(`/profile/${friend.friend_profile_id}`)
                        }}
                    >
                        <span>
                            <img src="/assets/user.png" className="img-fluid" alt="Default User"/>
                            <span className="dot"></span>
                        </span>
                        {friend.username}
                    </li>
                ))}
            </ul>
        </ul>
    )
}

export default SideNavRight
