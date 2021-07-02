export interface ConversationState{
    showConversation: boolean;
    messages: Message[];
    currentConversation: Conversation | null;
    loading: boolean;
    convos: Convo[];
    starting: number;
    hasMoreMessagesToLoad: boolean;
}

export interface ConversationPayload{
    showConversation: boolean;
    messages: Message[];
    conversation: Conversation | null;
    message: Message;
    convos: Convo[];
    convoId: number;
    profileId: number;
    hasMoreMessagesToLoad: boolean;
}

export interface Conversation{
    id: number;
    friendId: number;
    username: string;
}

export interface Message{
    id: number;
    message: string;
    seen: number;
    is_icon: number;
    created_at: number;
    profile_id: number;
}

export interface Convo{
    id: number;
    friendProfileId: number;
    lastMessage: Message;
}