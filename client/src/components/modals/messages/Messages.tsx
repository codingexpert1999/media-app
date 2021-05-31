import React from 'react'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../../actions/layoutActions';
import Message from './Message';

const Messages = () => {
    const dispatch = useDispatch();

    return (
        <div className="modal messages">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Messages</h5>
                        <button type="button" className="btn-close" onClick={() => dispatch(closeModal())}></button>
                    </div>

                    <div className="modal-body">
                        <ul className="messages-list">
                            <Message/>
                            <Message/>
                            <Message/>
                            <Message/>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
