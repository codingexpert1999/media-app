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

export interface Friendship{
    id: number;
    my_profile_id: number;
    friend_profile_id: number;
}