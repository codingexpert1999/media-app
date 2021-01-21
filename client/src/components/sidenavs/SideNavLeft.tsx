import React from 'react'

const SideNavLeft = () => {
    return (
        <ul className="sidenav sidenav-left shadow">
            <li>
                <button className="btn btn-primary">Create Post +</button>
            </li>
            <li>
                <button className="btn btn-add-friend btn-outline-success">Add Friend +</button>
            </li>
            <li className="clickable">Notifications <i className="fas fa-bell"></i></li>
            <li className="clickable">Messages <i className="fas fa-inbox"></i></li>
        </ul>
    )
}

export default SideNavLeft
