import { LayoutState } from "./layout";
import { PostState } from "./post";
import { ProfileState } from "./profile";
import { UserState } from "./user";

export interface State{
    layout: LayoutState;
    user: UserState;
    profile: ProfileState;
    post: PostState;
}