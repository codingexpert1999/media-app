import axios from "axios"
import { toast } from "react-toastify"
import { Dispatch } from "redux"
import { 
    CLOSE_CONVERSATION,
    GET_CONVERSATIONS, 
    GET_CONVERSATION_MESSAGES, 
    INCREASE_MESSAGE_STARTING, 
    NEW_MESSAGE, 
    READ_CONVERSATION_MESSAGES, 
    SET_CURRENT_CONVERSATION, 
    SET_HAS_MORE_MESSAGES_TO_LOAD, 
    SET_LOADING_MESSAGES, 
    SET_SHOW_CONVERSATION 
} from "../actionTypes/conversationTypes"
import { API } from "../helper"
import { Message } from "../interfaces/conversation"

export const setShowConversation = (showConversation: boolean) => {
    return {type: SET_SHOW_CONVERSATION, payload: {showConversation}}
}

export const setCurrentConversation = (
    id: (number | null), 
    userId: (number | null)=null, 
    profileId: (number | null)=null, 
    username: (string | null)=null
) => {
    if(id && userId && profileId && username){
        return async (dispatch: Dispatch) => {
            try {
                const res = await axios.get(`${API}/conversation/${id}/${userId}/${profileId}`, {withCredentials: true});

                dispatch({type: SET_CURRENT_CONVERSATION, payload: {conversation: {...res.data, username}}})
            } catch (err) {
                toast.error("Conversation coulgn't be set");
            }
        }
    }else{
        return {type: SET_CURRENT_CONVERSATION, payload: {conversation: null}}
    }
}

export const getConversationMessages = (userId: number, profileId: number, convoId: number, starting=0) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setLoadingMessages(true));

            const res = await axios.get(`${API}/conversation/${convoId}/messages/${userId}/${profileId}?starting=${starting}`, {withCredentials: true});

            dispatch({type: GET_CONVERSATION_MESSAGES, payload: {messages: res.data}})
        } catch (err) {
            console.log(err)
            dispatch(setHasMoreMessagesToLoad(false))
        }finally{
            dispatch(setLoadingMessages(false));
        }
    }
}

export const setLoadingMessages = (loading: boolean) => {
    return {type: SET_LOADING_MESSAGES, payload: loading}
}

export const newMessage = (message: Message, convoId: number) => {
    return {
        type: NEW_MESSAGE, payload: {message, convoId}
    } 
}

export const getConversations = (userId: number, profileId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await axios.get(`${API}/conversations/${userId}/${profileId}`, {withCredentials: true})

            dispatch({type: GET_CONVERSATIONS, payload: {convos: res.data}})
        } catch (err) {
            toast.error("Conversations coulnd't be fetched");
        }
    }
} 

export const readConversationMessages = (userId: number, profileId: number, convoId: number) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.put(`${API}/conversation/${convoId}/mesages/read/${userId}/${profileId}`, null, {withCredentials: true});

            dispatch({type: READ_CONVERSATION_MESSAGES, payload: {convoId, profileId}})
        } catch (err) {
            toast.error("Messages couldn't be read");
        }
    }
}

export const closeConversation = () => {
    return {type: CLOSE_CONVERSATION}
}

export const increaseMessageStarting = () => {
    return {type: INCREASE_MESSAGE_STARTING}
}

export const setHasMoreMessagesToLoad = (hasMoreMessagesToLoad: boolean) => {
    return {type: SET_HAS_MORE_MESSAGES_TO_LOAD, payload: {hasMoreMessagesToLoad}}
}