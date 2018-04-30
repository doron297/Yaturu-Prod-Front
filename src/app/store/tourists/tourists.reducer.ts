import { Reducer, Action } from 'redux';
import { TouristsState, initialState } from './tourists.interface';
import * as TouristsActions from './tourists.ac';
import { Tourist } from '../../shared/swagger/model/Tourist';

export const touristsReducer: Reducer<TouristsState> = (state: TouristsState = initialState, action: Action): TouristsState => {
    let newState: TouristsState = Object.assign({}, state);
    let newTourists: Array<Tourist>;
    let touristArr: Array<Tourist>;
    let updatedMap: Map<string, Tourist>;

    switch (action.type) {

        case TouristsActions.LOAD:
            let tourists = (<TouristsActions.TouristLoadAction>action).tourists;
            newState = Object.assign(newState, { touristMap: state.touristMap });
            newState.touristMap.set((<TouristsActions.TouristLoadAction>action).key, tourists);
            return newState;

        case TouristsActions.UPSERT:
            let newTrip = (<TouristsActions.TouristAction>action).tourist;
            touristArr = state.touristMap.get(newTrip.tripKey);
            if (!touristArr) {
                touristArr = [];
            }
            let oldTripIndex = touristArr.findIndex((value: Tourist) => {
                return value.key === newTrip.key;
            });
            let isNew = (oldTripIndex === -1);
            if (isNew) {
                newTourists = touristArr.concat(newTrip);
            } else {
                newTourists = touristArr.map((value: Tourist) => {
                    if (value.key === newTrip.key) {
                        return newTrip;
                    }
                    return value;
                });
            }
            updatedMap = state.touristMap;
            updatedMap.set(newTrip.tripKey, newTourists);
            newState = Object.assign(newState, {
                touristMap: updatedMap,
            });
            return newState;

        case TouristsActions.REMOVE:
            let tripToRemove = (<TouristsActions.TouristAction>action).tourist;
            touristArr = state.touristMap.get((<TouristsActions.TouristAction>action).key);
            newTourists = touristArr.filter((value: Tourist) => {
                return (value.key !== tripToRemove.key);
            });
            updatedMap.set(tripToRemove.tripKey, newTourists);
            newState = Object.assign(newState, {
                touristMap: updatedMap,
            });
            return newState;

        default:
            return state;
    }
};
