export interface UserState {
    username: string;
    token: string;
}

export const initialState: UserState = {
    username: null,
    token: null
};
