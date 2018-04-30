import { Site } from '../../shared/swagger/model/Site';

export interface SitesState {
    sites: Array<Site>;
    filter: string;
    filteredSites: Array<Site>;
    filterKeys: Array<string>;
}

export const initialState: SitesState = {
    sites: [],
    filter: null,
    filteredSites: [],
    filterKeys: null
};
