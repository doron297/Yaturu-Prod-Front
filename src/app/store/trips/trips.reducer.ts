import { Reducer, Action } from 'redux';
import { TripsState, initialState } from './trips.interface';
import * as TripsActions from './trips.ac';
import { Trip } from '../../shared/swagger/model/Trip';
import * as CRUD from '../../store/CRUDFunctions';

export const tripsReducer: Reducer<TripsState> = (state: TripsState = initialState, action: Action): TripsState => {
    let newState: TripsState = Object.assign({}, state);
    let newTrips: Array<Trip>;
    switch (action.type) {
        case TripsActions.LOAD:
            newState = Object.assign(newState, {
                trips: (<TripsActions.TripLoadAction>action).trips
                , filteredTrips: CRUD.filter((<TripsActions.TripLoadAction>action).trips, state.filter)
            });
            CRUD.sortbyDate(newState.filteredTrips);
            return newState;

        case TripsActions.UPSERT:
            let newTrip = (<TripsActions.TripAction>action).trip;
            let oldTripIndex = state.trips.findIndex((value: Trip) => {
                return value.key === newTrip.key;
            });
            let isNew = (oldTripIndex === -1);
            if (isNew) {
                newTrips = state.trips.concat(newTrip);
            } else {
                newTrips = state.trips.map((value: Trip) => {
                    if (value.key === newTrip.key) {
                        return newTrip;
                    }
                    return value;
                });
            }
            newState = Object.assign(newState, {
                trips: newTrips,
                filteredTrips: CRUD.filter(newTrips, state.filter)
            });
            CRUD.sortbyDate(newState.filteredTrips);
            return newState;

        case TripsActions.REMOVE:
            let tripToRemove = (<TripsActions.TripAction>action).trip;
            newTrips = state.trips.filter((value: Trip) => {
                return (value.key !== tripToRemove.key);
            });
            newState = Object.assign(newState, {
                trips: newTrips,
                filteredTrips: CRUD.filter(newTrips, state.filter)
            });
            CRUD.sortbyDate(newState.filteredTrips);
            return newState;

        case TripsActions.SEARCH:
            let filter = (<TripsActions.TripSearchAction>action).searchText;
            newState = Object.assign(newState, {
                filteredTrips: CRUD.filter(newState.trips, filter),
                filter: filter
            });
            CRUD.sortbyDate(newState.filteredTrips);
            return newState;

        case TripsActions.SET_ACTIVE:
            let activeTrip = (<TripsActions.TripAction>action).trip;
            newState = Object.assign(newState, {
                activeTrip: activeTrip
            });
            return newState;

        default:
            return state;
    }
};
