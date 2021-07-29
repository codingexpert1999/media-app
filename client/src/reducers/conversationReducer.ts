import { 
    GET_CONVERSATIONS, 
    GET_CONVERSATION_MESSAGES, 
    NEW_MESSAGE, 
    READ_CONVERSATION_MESSAGES, 
    SET_CURRENT_CONVERSATION, 
    SET_LOADING_MESSAGES, 
    SET_SHOW_CONVERSATION,
    CLOSE_CONVERSATION,
    INCREASE_MESSAGE_STARTING,
    SET_HAS_MORE_MESSAGES_TO_LOAD
} from "../actionTypes/conversationTypes";
import { ConversationPayload, ConversationState } from "../interfaces/conversation";

const initialState: ConversationState = {
    showConversation: false,
    messages: [],
    currentConversation: null,
    loading: false,
    convos: [],
    starting: 0,
    hasMoreMessagesToLoad: true
}

const conversationReducer = (state=initialState, action: {type: string; payload: ConversationPayload}) => {
    const {type, payload} = action;
    let messages = state.messages;
    let convos = state.convos;

    switch(type){
        case SET_SHOW_CONVERSATION:
            return {...state, showConversation: payload.showConversation}
        case SET_CURRENT_CONVERSATION:
            return {...state, currentConversation: payload.conversation, starting: 0, hasMoreMessagesToLoad: true}
        case GET_CONVERSATION_MESSAGES:
            if(payload.messages.length === 0){
                return state
            }
            
            let fetchedMessages = []

            for(let i = payload.messages.length - 1; i >= 0; i--){
                fetchedMessages.push(payload.messages[i])
            }

            return {...state, messages: [...fetchedMessages, ...messages]}
        case SET_LOADING_MESSAGES:
            return {...state, loading: payload}
        case NEW_MESSAGE:
            messages = [...messages, payload.message];

            convos = convos.map(convo => {
                if(convo.id === payload.convoId){
                    convo.lastMessage = payload.message
                }

                return convo;
            })

            return {...state, messages}
        case GET_CONVERSATIONS:
            return {...state, convos: payload.convos}
        case READ_CONVERSATION_MESSAGES:
            convos = convos.map(convo => {
                if(convo.id === payload.convoId){
                    convo.lastMessage.seen = 1;
                }

                return convo
            })

            messages = messages.map(message => {
                if(message.profile_id !== payload.profileId){
                    message.seen = 1
                }

                return message;
            })

            return {...state, convos, messages}
        case CLOSE_CONVERSATION:
            return {...state, messages: [], hasMoreMessagesToLoad: true}
        case INCREASE_MESSAGE_STARTING:
            return {...state, starting: state.starting + 15}
        case SET_HAS_MORE_MESSAGES_TO_LOAD:
            return {...state, hasMoreMessagesToLoad: payload.hasMoreMessagesToLoad}
        default:
            return state;
    }
}

export default conversationReducer;