import { Action, ActionCreator } from 'redux';
import { AppState } from '../../store/appState';

export const LOCALSTORAGE_TOKEN = 'token';
export const LOCALSTORAGE_TOKEN_SAVED_DATE = 'tokenDaySaved';

export const USER_SET_TOKEN = 'USER_SET_TOKEN';
export const USER_SET_ACTIVEUSER = 'USER_SET_ACTIVEUSER';

export interface SetUserAction extends Action {
    username: string;
}
export interface SetTokenAction extends Action {
    token: string;
}

export const setUser: ActionCreator<SetUserAction> = (username: string) => ({
    type: USER_SET_ACTIVEUSER,
    username: username
});
export const setToken: ActionCreator<SetTokenAction> = (token: string) => ({
    type: USER_SET_TOKEN,
    token: token
});

export const isAuthenticated = (state: AppState, dispatch: Function): boolean => {
    if (state.user.token !== null) {
        return true;
    } else {
        if (typeof (Storage) !== 'undefined') {
            if (localStorage.getItem(LOCALSTORAGE_TOKEN_SAVED_DATE) === (new Date(Date.now())).getDate().toString()) {
                dispatch(setToken(localStorage.getItem(LOCALSTORAGE_TOKEN)));
                return true;
            }
        }
    }
    return false;
};
