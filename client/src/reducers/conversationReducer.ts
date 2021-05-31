import { SET_SHOW_CONVERSATION } from "../actionTypes/conversationTypes";
import { ConversationPayload, ConversationState } from "../interfaces/conversation";

const initialState: ConversationState = {
    showConversation: false,
    messages: [],
    currentConversation: null
}

const conversationReducer = (state=initialState, action: {type: string; payload: ConversationPayload}) => {
    const {type, payload} = action;

    switch(type){
        case SET_SHOW_CONVERSATION:
            return {...state, showConversation: payload.showConversation}
        default:
            return state;
    }
}

export default conversationReducer;