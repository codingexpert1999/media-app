import React from 'react'

const SideNavRight = () => {
    return (
        <ul className="sidenav sidenav-right shadow">
            <h4 className="border-bottom">Friends <i className="fas fa-user-friends"></i></h4>

            <ul className="friends">
                <li className="friend">
                    <span>
                        <img src="/assets/user.png" className="img-fluid" alt="Default User"/>
                        <span className="dot"></span>
                    </span>
                    John Doe
                </li>
            </ul>
        </ul>
    )
}

export default SideNavRight
