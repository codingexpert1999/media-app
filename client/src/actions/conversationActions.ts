import { SET_SHOW_CONVERSATION } from "../actionTypes/conversationTypes"

export const setShowConversation = (showConversation: boolean) => {
    return {type: SET_SHOW_CONVERSATION, payload: {showConversation}}
}