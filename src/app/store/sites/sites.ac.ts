import { Action, ActionCreator } from 'redux';
import { Site } from '../../shared/swagger/model/Site';

export const LOAD = 'SITES_LOAD';
export const UPSERT = 'SITES_UPSERT';
export const REMOVE = 'SITES_REMOVE';
export const SEARCH = 'SITES_SEARCH';
export const FILTER = 'SITES_FILTER';

export interface SiteAction extends Action {
    site: Site;
}
export interface SiteSearchAction extends Action {
    searchText: string;
}

export interface SiteFilterKeysAction extends Action {
    filterKeys: Array<string>;
}
export interface SitesLoadAction extends Action {
    sites: Array<Site>;
}
export const loadSites: ActionCreator<SitesLoadAction> = (sites: Array<Site>) => ({
    type: LOAD,
    sites: sites
});
export const upsertSite: ActionCreator<SiteAction> = (site: Site) => ({
    type: UPSERT,
    site: site
});
export const removeSite: ActionCreator<SiteAction> = (site: Site) => ({
    type: REMOVE,
    site: site
});
export const searchSite: ActionCreator<SiteSearchAction> = (searchText: string) => ({
    type: SEARCH,
    searchText: searchText
});
export const filterSites: ActionCreator<SiteFilterKeysAction> = (filterKeys: Array<string>) => ({
    type: SEARCH,
    filterKeys: filterKeys
});
