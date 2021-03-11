export interface UserState{
    isAuthenticated: boolean;
    user: User;
}

export interface User{
    id: number;
    username: string;
    email: string;
}

export interface UserPayload{
    user:User;
}