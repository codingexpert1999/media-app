import React, { useEffect, useRef, useState } from 'react'
import Picker, { IEmojiData } from 'emoji-picker-react';
import ConversationMessage from './ConversationMessage';
import { useDispatch, useSelector } from 'react-redux';
import { 
    closeConversation, 
    getConversationMessages, 
    increaseMessageStarting, 
    newMessage, 
    readConversationMessages, 
    setCurrentConversation, 
    setHasMoreMessagesToLoad, 
    setShowConversation 
} from '../../actions/conversationActions';
import io from 'socket.io-client'
import { State } from '../../interfaces';
import { Message } from '../../interfaces/conversation';
import { Friend } from '../../interfaces/profile';

const Conversation = () => {
    const dispatch = useDispatch();

    const {user} = useSelector((state: State) => state.user)
    const {profile, friends} = useSelector((state: State) => state.profile)
    const {currentConversation, messages, loading, starting, hasMoreMessagesToLoad} = useSelector((state: State) => state.conversation)

    const messageRef = useRef<HTMLDivElement>(null);
    const conversationBodyRef = useRef<HTMLDivElement>(null);

    const socketClient = useRef<SocketIOClient.Socket>();

    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [textAreaHeight, setTextAreaHeight] = useState(35);
    const [backspaceWasLast, setBackspaceWasLast] = useState(false);
    const [friend, setFriend] = useState<Friend | undefined>(undefined);
    const [friendIsTyping, setFriendIsTyping] = useState(false);
    const [imTyping, setImTyping] = useState(false);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(0)
    const [messageSend, setMessageSend] = useState(false)

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
            socketClient.current.emit("message", profile.id, currentConversation.friendId, message, false);

            if(imTyping){
                setImTyping(false);
                socketClient.current.emit('typing', profile.id, false);
            }
        }

        setMessage("");
        setMessageSend(true)
    }

    const sendIcon = () => {
        if(socketClient.current && currentConversation){
            socketClient.current.emit("message", profile.id, currentConversation.friendId, "👍", true);
        }
        setMessageSend(true)
    }

    const scrollToBottom = () => {
        if(messageRef.current){
            messageRef.current.scrollIntoView(); 
        }
    }

    const scrollToPrevFirstMessage = () => {
        if(conversationBodyRef.current){
            conversationBodyRef.current.scrollTo({top: conversationBodyRef.current.scrollHeight - scrollHeight})
        }
    }

    const calculateTextWidth = (text: string) : number => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d");

        context!.font = getComputedStyle(document.body).font;

        return context!.measureText(text).width;
    }

    const scrollListener = (e: Event) => {
        if(conversationBodyRef.current){
            if(conversationBodyRef.current.scrollTop === 0){
                dispatch(increaseMessageStarting())
            }
        }
    }

    useEffect(() => {
        socketClient.current = io.connect("http://localhost:5000");

        window.addEventListener("click", screenClick);

        return () => {
            if(socketClient.current){
                if(currentConversation){
                    socketClient.current.emit('typing', profile.id, false)
                }

                socketClient.current.disconnect();
                socketClient.current = undefined;
            }

            window.removeEventListener("click", screenClick);
        }
    }, [])

    useEffect(() => {
        let conversationBodyElement = conversationBodyRef.current;

        if(currentConversation){
            setFriend(friends.find(friend => friend.friend_profile_id === currentConversation.friendId));
            dispatch(getConversationMessages(user.id, profile.id, currentConversation.id))
            dispatch(readConversationMessages(user.id, profile.id, currentConversation.id));

            if(conversationBodyRef.current){
                setScrollHeight(conversationBodyRef.current.scrollHeight);
                conversationBodyRef.current.addEventListener("scroll", scrollListener);
            }

            if(socketClient.current){
                socketClient.current.emit("open-convo", currentConversation.id);

                socketClient.current.on("new-message", (messageObj: Message) => {
                    dispatch(newMessage(messageObj, currentConversation.id));
                })

                socketClient.current.on(`${currentConversation.friendId}-is-typing`, (typing: boolean) => {
                    setFriendIsTyping(typing);

                    if(typing){
                        scrollToBottom();
                    }
                })
            }
        }

        return () => {
            if(conversationBodyElement){
                conversationBodyElement.removeEventListener("scroll", scrollListener);
            }
        }
    }, [currentConversation])

    useEffect(() => {
        if(!messagesLoaded && messages.length > 0 && !messageSend){
            scrollToBottom();
            setMessagesLoaded(true);
        }else if(messagesLoaded && messages.length > 0 && !messageSend){
            scrollToPrevFirstMessage();

            if(conversationBodyRef.current){
                setScrollHeight(conversationBodyRef.current.scrollHeight)
            }
        }else{
            scrollToBottom();
            setMessageSend(false)
        }

        let numberOfNewMessages = messages.slice(starting).length;

        if(numberOfNewMessages < 15){
            dispatch(setHasMoreMessagesToLoad(false))
        }
        
    }, [messages])

    useEffect(() => {
        if(starting > 0 && currentConversation && hasMoreMessagesToLoad){
            dispatch(getConversationMessages(user.id, profile.id, currentConversation.id, starting))
        }
    }, [starting])

    if(!currentConversation){
        return (
            <></>
        )
    }

    return (
        <div className="conversation">
            <div className="conversation-container">
                <div className="conversation-header">
                    <img src="/assets/user.png" alt="Default User"/>
                    <div className="user">
                        <span className="username">{friend?.username || ""}</span>
                        <div className={friend?.is_active === 1 ? "user-activity active" : "user-activity"}>
                            {friend?.is_active === 1 ? "Active" : "Inactive"}
                        </div>
                    </div>

                    <div className="close-conversation" onClick={() => {
                        dispatch(setCurrentConversation(null))
                        dispatch(closeConversation())
                        dispatch(setShowConversation(false))
                    }}>&#x2715;</div>
                </div>

                <div className="conversation-body" ref={conversationBodyRef}>
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

                    {   friendIsTyping &&
                        <div className="typing">
                            Typing <span>...</span>
                        </div>
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

                                if(e.target.value.length > 0){
                                    if(!imTyping){
                                        setImTyping(true);
                                        if(socketClient.current){
                                            socketClient.current.emit('typing', profile.id, true);
                                        }
                                    }
                                }else{
                                    if(imTyping && socketClient.current){
                                        socketClient.current.emit('typing', profile.id, false);
                                    }
                                }

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
