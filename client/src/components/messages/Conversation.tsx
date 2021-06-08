import React, { useEffect, useRef, useState } from 'react'
import Picker, { IEmojiData } from 'emoji-picker-react';
import ConversationMessage from './ConversationMessage';
import { useDispatch, useSelector } from 'react-redux';
import { getConversationMessages, newMessage, setShowConversation } from '../../actions/conversationActions';
import io from 'socket.io-client'
import { State } from '../../interfaces';
import { Message } from '../../interfaces/conversation';

const Conversation = () => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user)
    const {profile, friends} = useSelector((state: State) => state.profile)
    const {currentConversation, messages, loading} = useSelector((state: State) => state.conversation)

    const messageRef = useRef<HTMLDivElement>(null);

    const socketClient = useRef<SocketIOClient.Socket>();

    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [textAreaHeight, setTextAreaHeight] = useState(35);
    const [isActive, setIsActive] = useState(false);
    const [backspaceWasLast, setBackspaceWasLast] = useState(false);

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
            target.classList.contains("fas fa-thumbs-up") ||
            target.classList.contains("profile") ||
            target.classList.contains("profile-header")
        ){
            setShowEmojis(false);
        }
    }

    const sendMessage = () => {
        if(socketClient.current && currentConversation){
            socketClient.current.emit("message", currentConversation.id, profile.id, message, false);
        }

        setMessage("");
    }

    const sendIcon = () => {
        if(socketClient.current && currentConversation){
            socketClient.current.emit("message", currentConversation.id, profile.id, "👍", true);
        }
    }

    const scrollToBottom = () => {
        if(messageRef.current){
            messageRef.current.scrollIntoView(); 
        }
    }

    const calculateTextWidth = (text: string) : number => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d");

        context!.font = getComputedStyle(document.body).font;

        return context!.measureText(text).width;
    }

    useEffect(() => {
        socketClient.current = io.connect("http://localhost:5000");

        window.addEventListener("click", screenClick);

        return () => {
            if(socketClient.current){
                socketClient.current.disconnect();
                socketClient.current = undefined;
            }

            window.removeEventListener("click", screenClick);
        }
    }, [])

    useEffect(() => {
        if(currentConversation){
            if(socketClient.current){
                socketClient.current.emit("open-convo", currentConversation.id);

                socketClient.current.on("new-message", (messageObj: Message) => {
                    dispatch(newMessage(messageObj));
                })
            }

            setIsActive(friends.find(friend => friend.friend_profile_id === currentConversation!.friendId)?.is_active ? true : false);
            dispatch(getConversationMessages(user.id, profile.id, currentConversation.id))
        }
    }, [currentConversation])

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    if(!currentConversation){
        return (
            <></>
        )
    }

    return (
        <div className="conversation">
            <div className="conversation-container">
                <div className="conversation-header">
                    <img src="/assets/user.png" alt="Default User" />
                    <div className="user">
                        <span className="username">testuser</span>
                        <div className={isActive ? "user-activity active" : "user-activity"}>{isActive ? "Active" : "Inactive"}</div>
                    </div>

                    <div className="close-conversation" onClick={() => dispatch(setShowConversation(false))}>&#x2715;</div>
                </div>

                <div className="conversation-body">
                    {
                        loading && 
                        <div className="d-flex justify-content-center align-items-center loading">
                            <div className="spinner-border"></div>
                            <span>Loading...</span>
                        </div>
                    }

                    {
                        messages.map((message, i) => (
                            <ConversationMessage 
                                key={message.id} 
                                message={message} 
                                prevMessage={i > 0 ? messages[i - 1] : null} 
                                isLastMessage={i === messages.length - 1}
                            />
                        ))
                    }

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
                            rows={20}
                            onChange={e => {
                                setMessage(e.target.value);

                                let textWidth = calculateTextWidth(e.target.value);

                                if(e.target.value[e.target.value.length - 1] === "\n"){
                                    if(backspaceWasLast){
                                        setTextAreaHeight(textAreaHeight - 20)
                                    }else{
                                        setTextAreaHeight(textAreaHeight + 20)
                                    }
                                }else{
                                    if(textWidth >= 205 && e.target.value !== ""){
                                        if(textWidth % 200 <= 15){
                                            let newHeight = 15 + (Math.trunc(textWidth / 205) * 2 * 20);

                                            if(newHeight > 150){
                                                newHeight = 150
                                            }
        
                                            setTextAreaHeight(newHeight);
                                        }
                                        
                                    }else if(e.target.textLength < 21){
                                        setTextAreaHeight(35)
                                    }
                                }

                                setBackspaceWasLast(false)
                            }}
                            onFocus={() => setTyping(true)}
                            onBlur={() => setTyping(false)}
                            onKeyDown={e => {
                                if(e.key === "Enter" && !e.shiftKey){
                                    e.preventDefault();
                                    sendMessage();
                                }else if(e.key === "Backspace"){
                                    setBackspaceWasLast(true)
                                }
                            }}
                        ></textarea>

                        <i
                            onClick={() => setShowEmojis(true)}
                            className={typing || message.length > 0 ? "typing fas fa-smile" : "fas fa-smile"}
                        ></i>
                    </div>

                    <i className="fas fa-thumbs-up" onClick={() => sendIcon()}></i>
                </div>

                <div className="emojis" style={showEmojis ? {zIndex: 30, opacity: 1} : {zIndex: -9999, opacity: 0}}>
                    <Picker onEmojiClick={onEmojiClick} />
                </div>
            </div>
        </div>
    )
}

export default Conversation
