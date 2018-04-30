import { Reducer, Action } from 'redux';
import { GuidesState, initialState } from './guides.interface';
import * as CRUD from '../CRUDFunctions';
import * as GuidesActions from './guides.ac';
import { Guide } from '../../shared/swagger/model/Guide';

export const guidesReducer: Reducer<GuidesState> = (state: GuidesState = initialState, action: Action): GuidesState => {
    let newState: GuidesState = Object.assign({}, state);
    let newGuides: Array<Guide>;
    let filteredGuides: Array<Guide>;

    switch (action.type) {
        case GuidesActions.LOAD:
            newState = Object.assign(newState, { guides: (<GuidesActions.GuideLoadAction>action).guides });
            filteredGuides = CRUD.filter(newState.guides, newState.filter);
            newState = Object.assign(newState, { filteredGuides: filteredGuides });
            return newState;

        case GuidesActions.UPSERT:
            let newGuide = (<GuidesActions.GuideAction>action).guide;
            newGuides = CRUD.upsert(state.guides, newGuide);
            newState = Object.assign(newState, { guides: newGuides });
            filteredGuides = CRUD.filter(newState.guides, newState.filter);
            newState = Object.assign(newState, { filteredGuides: filteredGuides });
            return newState;

        case GuidesActions.REMOVE:
            let guideToRemove = (<GuidesActions.GuideAction>action).guide;
            newGuides = CRUD.remove(state.guides, guideToRemove);
            newState = Object.assign(newState, { guides: newGuides });
            filteredGuides = CRUD.filter(newState.guides, newState.filter);
            newState = Object.assign(newState, { filteredGuides: filteredGuides });
            return newState;

        case GuidesActions.SEARCH:
            let filter = (<GuidesActions.GuideSearchAction>action).searchText;
            filteredGuides = CRUD.filter(newState.guides, filter);
            newState = Object.assign(newState, { filteredGuides: filteredGuides, filter: filter });
            return newState;

        default:
            return state;
    }
};
