import { combineReducers, Reducer } from 'redux';
import { AppState } from './appState';
import { guidesReducer } from './guides/guides.reducer';
import { sitesReducer } from './sites/sites.reducer';
import { contentReducer } from './content/content.reducer';
import { tripsReducer } from './trips/trips.reducer';
import { DaysReducer } from './days/days.reducer';
import { UserReducer } from './user/user.reducer';
import { regionsReducer } from './region/region.reducer';
import { touristsReducer } from './tourists/tourists.reducer';
export const rootReducer = combineReducers({
    sites: sitesReducer,
    guides: guidesReducer,
    content: contentReducer,
    trips: tripsReducer,
    days: DaysReducer,
    user: UserReducer,
    regions: regionsReducer,
    tourists: touristsReducer
}) as Reducer<AppState>;
