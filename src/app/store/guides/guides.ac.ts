import { Action, ActionCreator } from 'redux';
import { Guide } from '../../shared/swagger';

export const LOAD = 'GUIDES_LOAD';
export const UPSERT = 'GUIDES_UPSERT';
export const REMOVE = 'GUIDES_REMOVE';
export const SEARCH = 'GUIDES_SEARCH';

export interface GuideAction extends Action {
    guide: Guide;
}
export interface GuideSearchAction extends Action {
    searchText: string;
}
export interface GuideLoadAction extends Action {
    guides: Array<Guide>;
}

export const loadGuides: ActionCreator<GuideLoadAction> = (guides: Array<Guide>) => ({
    type: LOAD,
    guides: guides
});
export const upsertGuide: ActionCreator<GuideAction> = (guide: Guide) => ({
    type: UPSERT,
    guide: guide
});
export const removeGuide: ActionCreator<GuideAction> = (guide: Guide) => ({
    type: REMOVE,
    guide: guide
});
export const searchGuide: ActionCreator<GuideSearchAction> = (searchText: string) => ({
    type: SEARCH,
    searchText: searchText
});
