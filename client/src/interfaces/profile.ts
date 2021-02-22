export interface ProfileState{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    friends: Friend[];
}

export interface ProfilePayload{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    friends: Friend[];
}

export interface Profile{
    id: number;
    profile_image: string;
    profile_description: string;
    friends: number;
    posts: number;
    status: string;
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