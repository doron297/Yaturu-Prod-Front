import { Action, ActionCreator } from 'redux';
import { Trip } from '../../shared/swagger/model/Trip';

export const LOAD = 'TRIPS_LOAD';
export const UPSERT = 'TRIPS_UPSERT';
export const REMOVE = 'TRIPS_REMOVE';
export const SEARCH = 'TRIPS_SEARCH';
export const SET_ACTIVE = 'TRIPS_SET_ACTIVE';
export const ADD_DAY = 'TRIPS_ADD_DAY';
export const REMOVE_DAY = 'TRIPS_REMOVE_DAY';
export const ADD_SITE = 'TRIPS_ADD_SITE';
export const REMOVE_SITE = 'TRIPS_REMOVE_SITE';

export interface TripAction extends Action {
    trip: Trip;
}
export interface TripSearchAction extends Action {
    searchText: string;
}

export interface TripLoadAction extends Action {
    trips: Array<Trip>;
}

export const loadTrips: ActionCreator<TripLoadAction> = (trips: Array<Trip>) => ({
    type: LOAD,
    trips: trips
});
export const upsertTrip: ActionCreator<TripAction> = (trip: Trip) => ({
    type: UPSERT,
    trip: trip
});
export const removeTrip: ActionCreator<TripAction> = (trip: Trip) => ({
    type: REMOVE,
    trip: trip
});
export const searchTrips: ActionCreator<TripSearchAction> = (searchText: string) => ({
    type: SEARCH,
    searchText: searchText
});
export const setActiveTrip: ActionCreator<TripAction> = (trip: Trip) => ({
    type: SET_ACTIVE,
    trip: trip
});
