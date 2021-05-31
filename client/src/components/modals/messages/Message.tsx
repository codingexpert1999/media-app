import React from 'react'

const Message = () => {
    return (
        <li className="message">
            <div className="user">
                <img src="/assets/user.png" alt="User Default" />
                <span>testuser</span>
                <div className="user-activity"></div>
            </div>

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, atque?</p>
        </li>
    )
}

export default Message
