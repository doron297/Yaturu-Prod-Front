import { Region } from '../../shared/swagger/model/Region';

export interface RegionState {
    regions: Array<Region>;
    filter: string;
    filteredRegions: Array<Region>;
}

export const initialState: RegionState = {
    regions: [],
    filter: null,
    filteredRegions: []
};
