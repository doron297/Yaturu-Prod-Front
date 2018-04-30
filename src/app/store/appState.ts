import * as ISites from './sites/sites.interface';
import * as IGuides from './guides/guides.interface';
import * as IContent from './content/content.interface';
import * as ITrips from './trips/trips.interface';
import * as IDays from './days/days.interface';
import * as IUser from './user/user.interface';
import * as IRegion from './region/region.interface';
import * as ITourist from './tourists/tourists.interface';
export interface AppState {
    sites: ISites.SitesState;
    guides: IGuides.GuidesState;
    content: IContent.ContentState;
    trips: ITrips.TripsState;
    days: IDays.DaysState;
    user: IUser.UserState;
    regions: IRegion.RegionState;
    tourists: ITourist.TouristsState;

}
export const initialState: AppState = {
    sites: ISites.initialState,
    guides: IGuides.initialState,
    content: IContent.initialState,
    trips: ITrips.initialState,
    days: IDays.initialState,
    user: IUser.initialState,
    regions: IRegion.initialState,
    tourists: ITourist.initialState,

};
