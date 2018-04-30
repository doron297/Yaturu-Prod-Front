import { Trip } from '../../shared/swagger/model/Trip';

export interface TripsState {
    trips: Array<Trip>;
    filter: string;
    filteredTrips: Array<Trip>;
    activeTrip: Trip;
}

export const initialState: TripsState = {
    trips: [],
    filter: null,
    filteredTrips: [],
    activeTrip: null
};
