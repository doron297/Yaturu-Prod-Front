import { Action, ActionCreator } from 'redux';
import { Content } from '../../shared/swagger/model/Content';

export const LOAD = 'Content_LOAD';
export const UPSERT = 'Content_UPSERT';
export const REMOVE = 'Content_REMOVE';
export const SEARCH = 'Content_SEARCH';
export const FILTER_KEYS = 'Content_FILTER_KEYS';

export interface ContentAction extends Action {
    content: Content;
}
export interface ContentSearchAction extends Action {
    searchText: string;
}
export interface ContentFilterAction extends Action {
    keys: Array<string>;
}
export interface ContentLoadAction extends Action {
    contentArr: Array<Content>;
}

export const loadContent: ActionCreator<Action> = (contentArr: Array<Content>) => ({
    type: LOAD,
    contentArr: contentArr
});
export const upsertContent: ActionCreator<ContentAction> = (content: Content) => ({
    type: UPSERT,
    content: content
});
export const removeContent: ActionCreator<ContentAction> = (content: Content) => ({
    type: REMOVE,
    content: content
});
export const searchContent: ActionCreator<ContentSearchAction> = (searchText: string) => ({
    type: SEARCH,
    searchText: searchText
});
export const filterContentByKeys: ActionCreator<ContentFilterAction> = (keys: Array<string>) => ({
    type: FILTER_KEYS,
    keys: keys
});
