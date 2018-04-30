import { Day } from '../../shared/swagger/model/Day';

export interface DaysState {
    days: Array<Day>;
    filteredDays: Array<Day>;
    activeDay: Day;
    filterKeys: Array<string>;
}

export const initialState: DaysState = {
    days: [],
    filteredDays: [],
    filterKeys: [],
    activeDay: null
};
