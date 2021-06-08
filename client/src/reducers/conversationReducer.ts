import { GET_CONVERSATIONS, GET_CONVERSATION_MESSAGES, NEW_MESSAGE, SET_CURRENT_CONVERSATION, SET_LOADING_MESSAGES, SET_SHOW_CONVERSATION } from "../actionTypes/conversationTypes";
import { ConversationPayload, ConversationState } from "../interfaces/conversation";

const initialState: ConversationState = {
    showConversation: false,
    messages: [],
    currentConversation: null,
    loading: false,
    convos: []
}

const conversationReducer = (state=initialState, action: {type: string; payload: ConversationPayload}) => {
    const {type, payload} = action;
    let messages = [...state.messages];

    switch(type){
        case SET_SHOW_CONVERSATION:
            return {...state, showConversation: payload.showConversation}
        case SET_CURRENT_CONVERSATION:
            return {...state, currentConversation: payload.conversation}
        case GET_CONVERSATION_MESSAGES:
            return {...state, messages: payload.messages}
        case SET_LOADING_MESSAGES:
            return {...state, loading: payload}
        case NEW_MESSAGE:
            messages = [...messages, payload.message];
            return {...state, messages}
        case GET_CONVERSATIONS:
            return {...state, convos: payload.convos}
        default:
            return state;
    }
}

export default conversationReducer;