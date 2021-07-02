
export interface User{
    id: number;
    username: string;
    email: string;
    password: string | undefined;
}

export interface UserPayload{
    username: string;
    email: string;
}

export interface Post{
    id: number;
    post_text: string;
    post_image: string;
    post_video: string;
    likes: number;
    profile_id: number;
    created_at: string;
}

export interface Comment{
    id: number;
    comment_text: string;
    likes: number;
    profile_id: number;
    created_at: string;
}

export interface Answer{
    id: number;
    answer_text: string;
    likes: number;
    profile_id: number;
    created_at: string;
}

export interface Profile{
    id: number;
    profile_image: string;
    profile_description: string;
    friends: number;
    posts: number;
    status: number;
    user_id: number;
}

export interface Friend{
    id: number;
    friend_profile_id: number;
    username: string;
    is_active: number;
}

export interface JwtError{
    error: string;
}

export interface Notification{
    id: number;
    notification_type: string;
    notification: string;
    sender_profile_id: number;
    seen: number;
    created_at: string;
    profile_image: string;
}

export interface Message{
    id: number;
    message: string;
    seen: number;
    created_at: string;
    profile_id: number;
    conversation_id: number;
    is_icon: number;
}

export interface Conversation{
    id: number;
    profile_1_id: number;
    profile_2_id: number;
}

export interface Convo{
    id: number;
    friendProfileId: number;
    username: string;
    lastMessage: Message | undefined;
}