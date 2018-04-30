import { Reducer, Action } from 'redux';
import { ContentState, initialState } from './content.interface';
import * as ContentActions from './content.ac';
import { Content } from '../../shared/swagger/model/Content';
import * as CRUD from '../../store/CRUDFunctions';

export const contentReducer: Reducer<ContentState> = (state: ContentState = initialState, action: Action): ContentState => {
    let newState: ContentState = Object.assign({}, state);
    let newContent: Array<Content>;
    switch (action.type) {
        case ContentActions.LOAD:
            newState = Object.assign(newState, { content: (<ContentActions.ContentLoadAction>action).contentArr });
            let filteredContent = CRUD.filter(newState.content, newState.filter);
            newState = Object.assign(newState, { filteredContent: filteredContent });
            return newState;

        case ContentActions.UPSERT:
            let newContentItem = (<ContentActions.ContentAction>action).content;
            let oldContentIndex = state.content.findIndex((value: Content) => {
                return value.key === newContentItem.key;
            });
            let isNewSite = (oldContentIndex === -1);
            if (isNewSite) {
                newContent = state.content.concat(newContentItem);
            } else {
                newContent = state.content.map((value: Content) => {
                    if (value.key === newContentItem.key) {
                        return newContentItem;
                    }
                    return value;
                });
            }
            newState = Object.assign(newState, {
                content: newContent,
                filteredContent: CRUD.filter(newContent, state.filter)
            });
            return newState;

        case ContentActions.REMOVE:
            let contentToRemove = (<ContentActions.ContentAction>action).content;
            newContent = state.content.filter((value: Content) => {
                return (value.key !== contentToRemove.key);
            });
            newState = Object.assign(newState, {
                content: newContent,
                filteredContent: CRUD.filter(newContent, state.filter)
            });
            return newState;

        case ContentActions.SEARCH:
            let filter = (<ContentActions.ContentSearchAction>action).searchText;
            newState = Object.assign(newState, {
                filteredContent: CRUD.filter(state.content, filter),
                filter: filter
            });
            return newState;

        case ContentActions.FILTER_KEYS:
            let filterKeys = (<ContentActions.ContentFilterAction>action).keys;
            newState = Object.assign(newState, {
                filteredContent: CRUD.includeOnly(state.content, filterKeys),
            });
            return newState;

        default:
            return state;
    }
};
