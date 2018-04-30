import { Reducer, Action } from 'redux';
import { DaysState, initialState } from './days.interface';
import * as DaysActions from './days.ac';
import { Day } from '../../shared/swagger/model/Day';
import * as CRUD from '../../store/CRUDFunctions';

export const DaysReducer: Reducer<DaysState> = (state: DaysState = initialState, action: Action): DaysState => {
    let newState: DaysState = Object.assign({}, state);
    let newDays: Array<Day>;
    switch (action.type) {
        case DaysActions.LOAD:
            newState = Object.assign(newState, {
                days: (<DaysActions.LoadDaysAction>action).daysArray,
                filteredDays: (<DaysActions.LoadDaysAction>action).daysArray
            });
            return newState;

        case DaysActions.UPSERT:
            let newDay = (<DaysActions.DaysAction>action).day;
            let oldDayIndex = state.days.findIndex((value: Day) => {
                return value.key === newDay.key;
            });
            let isNewDay = (oldDayIndex === -1);
            if (isNewDay) {
                newDays = state.days.concat(newDay);
            } else {
                newDays = state.days.map((value: Day) => {
                    if (value.key === newDay.key) {
                        return newDay;
                    }
                    return value;
                });
            }
            newState = Object.assign(newState, {
                days: newDays,
            });
            return newState;

        case DaysActions.REMOVE:
            let dayToRemove = (<DaysActions.DaysAction>action).day;
            newDays = state.days.filter((value: Day) => {
                return (value.key !== dayToRemove.key);
            });
            newState = Object.assign(newState, {
                days: newDays,
            });
            return newState;

        case DaysActions.SET_ACTIVE:
            let activeDay = (<DaysActions.DaysAction>action).day;
            newState = Object.assign(newState, {
                activeDay: activeDay
            });
            return newState;

        case DaysActions.FILTER:
            let filterKeys = (<DaysActions.DaysFilterAction>action).filterKeys;
            let filteredDays = CRUD.includeOnly(state.days, filterKeys);
            let orderedFilteredDays = [];
            filterKeys.forEach((dayKey) => {
                filteredDays.forEach((filtredDay) => {
                    if (filtredDay.key === dayKey) {
                        orderedFilteredDays.push(filtredDay);
                    }
                });
            });
            newState = Object.assign(newState, {
                filterKeys: filterKeys,
                filteredDays: orderedFilteredDays
            });
            return newState;

        default:
            return state;
    }
};
