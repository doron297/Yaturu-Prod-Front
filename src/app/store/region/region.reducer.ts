import { Reducer, Action } from 'redux';
import { RegionState, initialState } from './region.interface';
import * as CRUD from '../CRUDFunctions';
import * as RegionActions from './region.ac';
import { Region } from '../../shared/swagger/model/Region';

export const regionsReducer: Reducer<RegionState> = (state: RegionState = initialState, action: Action): RegionState => {
    let newState: RegionState = Object.assign({}, state);
    let newRegions: Array<Region>;
    let filteredRegions: Array<Region>;

    switch (action.type) {
        case RegionActions.LOAD:
            newState = Object.assign(newState, { regions: (<RegionActions.RegionLoadAction>action).regions });
            filteredRegions = CRUD.filter(newState.regions, newState.filter);
            newState = Object.assign(newState, { filteredRegions: filteredRegions });
            return newState;

        case RegionActions.UPSERT:
            let newRegion = (<RegionActions.RegionAction>action).region;
            newRegions = CRUD.upsert(state.regions, newRegion);
            newState = Object.assign(newState, { regions: newRegions });
            filteredRegions = CRUD.filter(newState.regions, newState.filter);
            newState = Object.assign(newState, { filteredRegions: filteredRegions });
            return newState;

        case RegionActions.REMOVE:
            let regionToRemove = (<RegionActions.RegionAction>action).region;
            newRegions = CRUD.remove(state.regions, regionToRemove);
            newState = Object.assign(newState, { regions: newRegions });
            filteredRegions = CRUD.filter(newState.regions, newState.filter);
            newState = Object.assign(newState, { filteredRegions: filteredRegions });
            return newState;

        case RegionActions.SEARCH:
            let filter = (<RegionActions.RegionSearchAction>action).searchText;
            filteredRegions = CRUD.filter(newState.regions, filter);
            newState = Object.assign(newState, { filteredRegions: filteredRegions, filter: filter });
            return newState;

        default:
            return state;
    }
};
