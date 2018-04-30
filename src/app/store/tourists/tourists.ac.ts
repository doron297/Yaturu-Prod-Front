import { Action, ActionCreator } from 'redux';
import { Tourist } from '../../shared/swagger';

export const LOAD = 'TOURISTS_LOAD';
export const UPSERT = 'TOURISTS_UPSERT';
export const REMOVE = 'TOURISTS_REMOVE';
export const SEARCH = 'TOURISTS_SEARCH';

export interface TouristAction extends Action {
    tourist: Tourist;
    key: string;
}

export interface TouristLoadAction extends Action {
    tourists: Array<Tourist>;
    key: string;
}

export const loadTourists: ActionCreator<TouristLoadAction> = (tourists: Array<Tourist>, key: string) => ({
    type: LOAD,
    tourists: tourists,
    key: key
});
export const upsertTourist: ActionCreator<TouristAction> = (tourist: Tourist, key: string) => ({
    type: UPSERT,
    tourist: tourist,
    key: key,

});
export const removeTourist: ActionCreator<TouristAction> = (tourist: Tourist, key: string) => ({
    type: REMOVE,
    tourist: tourist,
    key: key,
});
