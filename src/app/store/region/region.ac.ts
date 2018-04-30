import { Action, ActionCreator } from 'redux';
import { Region } from '../../shared/swagger';

export const LOAD = 'REGIONS_LOAD';
export const UPSERT = 'REGIONS_UPSERT';
export const REMOVE = 'REGIONS_REMOVE';
export const SEARCH = 'REGIONS_SEARCH';

export interface RegionAction extends Action {
    region: Region;
}
export interface RegionSearchAction extends Action {
    searchText: string;
}
export interface RegionLoadAction extends Action {
    regions: Array<Region>;
}

export const loadRegions: ActionCreator<RegionLoadAction> = (regions: Array<Region>) => ({
    type: LOAD,
    regions: regions
});
export const upsertRegion: ActionCreator<RegionAction> = (region: Region) => ({
    type: UPSERT,
    region: region
});
export const removeRegion: ActionCreator<RegionAction> = (region: Region) => ({
    type: REMOVE,
    region: region
});
export const searchRegion: ActionCreator<RegionSearchAction> = (searchText: string) => ({
    type: SEARCH,
    searchText: searchText
});
