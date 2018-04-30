import { Reducer, Action } from 'redux';
import { UserState, initialState } from './user.interface';
import * as UserActions from './user.ac';

export const UserReducer: Reducer<UserState> = (state: UserState = initialState, action: Action): UserState => {
    let newState: UserState = Object.assign({}, state);
    switch (action.type) {
        case UserActions.USER_SET_ACTIVEUSER:
            newState.username = (<UserActions.SetUserAction>action).username;
            return newState;

        case UserActions.USER_SET_TOKEN:
            newState.token = (<UserActions.SetTokenAction>action).token;
            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem(UserActions.LOCALSTORAGE_TOKEN, newState.token);
                localStorage.setItem(UserActions.LOCALSTORAGE_TOKEN_SAVED_DATE,
                    (new Date(Date.now())).getDate().toString());
            }
            return newState;

        default:
            return state;
    }
};
