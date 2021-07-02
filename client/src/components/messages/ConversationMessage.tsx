import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../interfaces'
import { Message } from '../../interfaces/conversation'
import Moment from 'react-moment'

const ConversationMessage = (props: {
    message: Message; 
    prevMessage: Message | null; 
    isLastMessage: boolean; 
}) => {
    const {profile} = useSelector((state: State) => state.profile);

    const sended = props.message.profile_id === profile.id;

    const timeDifference = props.prevMessage ?
        (new Date(props.message.created_at).getTime()) - (new Date(props.prevMessage.created_at).getTime()) 
        : Date.now() - (new Date(props.message.created_at).getTime())

    const showTime = timeDifference >= 600000

    return (
        <div className={sended ? "conversation-message sended" : "conversation-message received"}>
            {
                showTime &&
                <div className="time-sended">
                    {
                        timeDifference >= 86400000 ? 
                        <Moment format="DD/MM/YYYY hh:mm:ss">{props.message.created_at}</Moment> :
                        <Moment format="hh:mm">{props.message.created_at}</Moment>
                    }
                </div>
            }

            <p className={props.message.is_icon === 1 ? "message icon" : "message"}>{props.message.message}</p>

            {props.isLastMessage && props.message.seen === 1 && <span className="seen">Seen</span>}
        </div>
    )
}

export default ConversationMessage
