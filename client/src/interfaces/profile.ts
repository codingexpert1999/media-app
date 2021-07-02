export interface ProfileState{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    sendedFriendRequests: SendedFriendRequest[];
    friends: Friend[];
    currentProfile: Profile;
    searchResults: SearchedProfile[];
    searchMatches: SearchMatch[];
    showSearchingResults: boolean;
    canClickRequestButton: boolean;
}

export interface ProfilePayload{
    profile: Profile;
    notifications: Notification[];
    friendRequests: FriendRequest[];
    friends: Friend[];
    description: string;
    username: string;
    searchResults: SearchedProfile[];
    searchMatches: SearchMatch[];
    canClickRequestButton: boolean;
    friendshipId: number;
    sendedFriendRequests: SendedFriendRequest[];
    receiverProfileId: number;
    senderProfileId: number;
    notificationId: number;
    isActive: number;
    changedFriendsActivity: ChangedFriendActivity[]
}

export interface Profile{
    id: number;
    profile_image: string;
    profile_description: string;
    friends: number;
    posts: number;
    status: string;
    username: string | null;
    is_active: number;
}

export interface Notification{
    id: number;
    notification_type: string;
    notification: string;
    sender_profile_id: number;
    created_at: string;
    seen: number;
    profile_image: string;
}

export interface FriendRequest{
    id: number;
    sender_profile_id: number;
}

export interface SendedFriendRequest{
    id: number;
    receiver_profile_id: number;
}

export interface Friend{
    id: number;
    friend_profile_id: number;
    username: string;
    is_active: number;
}

export interface SearchedProfile{
    profile_id: number;
    username: string;
    profile_image: string;
}

export interface SearchMatch{
    username: string;
}

export interface ChangedFriendActivity{
    index: number;
    is_active: number;
}