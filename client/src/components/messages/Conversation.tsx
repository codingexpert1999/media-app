import React, { useEffect, useRef, useState } from 'react'
import Picker, { IEmojiData } from 'emoji-picker-react';
import ConversationMessage from './ConversationMessage';
import { useDispatch } from 'react-redux';
import { setShowConversation } from '../../actions/conversationActions';

const Conversation = () => {
    const dispatch = useDispatch();

    const messageRef = useRef<HTMLDivElement>(null);

    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [textAreaHeight, setTextAreaHeight] = useState(35);

    const onEmojiClick = (e: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
        setMessage(message + data.emoji);
    };

    const screenClick = (e: MouseEvent) => {
        const target = e.target! as HTMLElement;

        if(
            target.classList.contains("dashboard") ||
            target.classList.contains("conversation-header") ||
            target.classList.contains("conversation-body") ||
            target.classList.contains("conversation-bottom") ||
            target.classList.contains("fas fa-thumbs-up")
        ){
            setShowEmojis(false);
        }
    }

    useEffect(() => {
        messageRef.current?.scrollIntoView();

        window.addEventListener("click", screenClick);


        return () => {
            window.removeEventListener("click", screenClick);
        }
    }, [])

    return (
        <div className="conversation">
            <div className="conversation-container">
                <div className="conversation-header">
                    <img src="/assets/user.png" alt="Default User" />
                    <div className="user">
                        <span className="username">testuser</span>
                        <div className="user-activity active">Active</div>
                    </div>

                    <div className="close-conversation" onClick={() => dispatch(setShowConversation(false))}>&#x2715;</div>
                </div>

                <div className="conversation-body">
                    <ConversationMessage/>

                    <div className="message-ref" ref={messageRef}></div>
                </div>

                <div className="conversation-bottom">
                    <div className="message-input">
                        <textarea
                            style={{height: textAreaHeight}}
                            maxLength={1000}
                            placeholder="Aa" 
                            className={typing || message.length > 0 ? "typing" : ""}
                            value={message}
                            onChange={e => {
                                setMessage(e.target.value)

                                if(e.target.textLength % 21 === 0 && e.target.value !== ""){
                                    let newHeight = 15 + (e.target.textLength / 21) * 2 * 20;

                                    if(newHeight > 150){
                                        newHeight = 150
                                    }

                                    setTextAreaHeight(newHeight);
                                }else if(e.target.textLength < 21){
                                    setTextAreaHeight(35)
                                }
                            }}
                            onFocus={() => setTyping(true)}
                            onBlur={() => setTyping(false)}
                        ></textarea>

                        <i
                            onClick={() => setShowEmojis(true)}
                            className={typing || message.length > 0 ? "typing fas fa-smile" : "fas fa-smile"}
                        ></i>
                    </div>

                    <i className="fas fa-thumbs-up"></i>
                </div>

                <div className="emojis" style={showEmojis ? {zIndex: 30, opacity: 1} : {zIndex: -9999, opacity: 0}}>
                    <Picker onEmojiClick={onEmojiClick} />
                </div>
            </div>
        </div>
    )
}

export default Conversation
