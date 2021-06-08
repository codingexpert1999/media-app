import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../../actions/layoutActions';
import { State } from '../../../interfaces';
import Message from './Message';

const Messages = () => {
    const dispatch = useDispatch();

    const {convos} = useSelector((state: State) => state.conversation)

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
                            {
                                convos.map(convo => (
                                    <Message 
                                        key={convo.id} 
                                        message={convo.lastMessage} 
                                        friendProfileId={convo.friendProfileId}
                                    />
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
