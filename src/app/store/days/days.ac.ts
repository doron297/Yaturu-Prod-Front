import { Action, ActionCreator } from 'redux';
import { Day } from '../../shared/swagger/model/Day';

export const LOAD = 'DAYS_LOAD';
export const UPSERT = 'DAYS_UPSERT';
export const REMOVE = 'DAYS_REMOVE';
export const FILTER = 'DAYS_FILTER';
export const SET_ACTIVE = 'DAYS_SET_ACTIVE';

export interface DaysAction extends Action {
    day: Day;
}
export interface DaysFilterAction extends Action {
    filterKeys: Array<string>;
}
export interface LoadDaysAction extends Action {
    daysArray: Array<Day>;
}

export const loadDays: ActionCreator<LoadDaysAction> = (daysArray: Array<Day>) => ({
    type: LOAD,
    daysArray: daysArray
});
export const upsertDay: ActionCreator<DaysAction> = (day: Day) => ({
    type: UPSERT,
    day: day
});
export const removeDay: ActionCreator<DaysAction> = (day: Day) => ({
    type: REMOVE,
    day: day
});
export const setActiveDay: ActionCreator<DaysAction> = (day: Day) => ({
    type: SET_ACTIVE,
    day: day
});
export const setFilterKeys: ActionCreator<DaysFilterAction> = (filterKeys: Array<string>) => ({
    type: FILTER,
    filterKeys: filterKeys
});
