export interface ConversationState{
    showConversation: boolean;
    messages: Message[];
    currentConversation: Conversation | null;
}

export interface ConversationPayload{
    showConversation: boolean;
}

export interface Message{}

export interface Conversation{}