import { LayoutState } from "./layout";
import { UserState } from "./user";

export interface State{
    layout: LayoutState;
    user: UserState;
}