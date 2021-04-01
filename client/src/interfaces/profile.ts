import { Post } from "./post";

export interface ProfileState{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    friends: Friend[];
    currentProfile: Profile;
}

export interface ProfilePayload{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    friends: Friend[];
    description: string;
    username: string;
}

export interface Profile{
    id: number;
    profile_image: string;
    profile_description: string;
    friends: number;
    posts: number;
    status: string;
    username: string | null;
}

export interface Notification{
    id: number;
    notification_type: string;
    notification: string;
    sender_profile_id: number;
    created_at: string;
}

export interface FriendRequest{
    id: number;
    sender_profile_id: number;
}

export interface Friend{
    id: number;
    friend_profile_id: number;
}