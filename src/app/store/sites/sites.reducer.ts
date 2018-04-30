import { Reducer, Action } from 'redux';
import { SitesState, initialState } from './sites.interface';
import * as SitesActions from './sites.ac';
import { Site } from '../../shared/swagger/model/Site';
import * as CRUD from '../../store/CRUDFunctions';

export const sitesReducer: Reducer<SitesState> = (state: SitesState = initialState, action: Action): SitesState => {
    let newState: SitesState = Object.assign({}, state);
    let newSites: Array<Site>;

    switch (action.type) {
        case SitesActions.LOAD:
            let sites = (<SitesActions.SitesLoadAction>action).sites;
            newState = Object.assign(newState, { sites: sites });
            newState = Object.assign(newState, { filteredSites: CRUD.filter(newState.sites, newState.filter) });
            return newState;
        case SitesActions.UPSERT:
            let newSite = (<SitesActions.SiteAction>action).site;
            newSites = CRUD.upsert(state.sites, newSite);
            newState = Object.assign(newState, { sites: newSites });
            newState = Object.assign(newState, { filteredSites: CRUD.filter(newState.sites, newState.filter) });
            return newState;

        case SitesActions.REMOVE:
            let siteToRemove = (<SitesActions.SiteAction>action).site;
            newSites = CRUD.remove(state.sites, siteToRemove);
            newState = Object.assign(newState, { sites: newSites });
            newState = Object.assign(newState, { filteredSites: CRUD.filter(newState.sites, newState.filter) });
            return newState;

        case SitesActions.SEARCH:
            let filter = (<SitesActions.SiteSearchAction>action).searchText;
            newState = Object.assign(newState,
                {
                    filteredSites: CRUD.filter(newState.sites, filter),
                    filter: filter, filterKeys: null
                });
            return newState;

        case SitesActions.FILTER:
            let filterKeys = (<SitesActions.SiteFilterKeysAction>action).filterKeys;
            newState = Object.assign(newState, {
                filteredSites: CRUD.includeOnly(newState.sites, filterKeys),
                filterKeys: filterKeys,
                filter: null
            });
            return newState;

        default:
            return state;
    }
};
