import { Guide } from '../../shared/swagger/model/Guide';

export interface GuidesState {
    guides: Array<Guide>;
    filter: string;
    filteredGuides: Array<Guide>;
}

export const initialState: GuidesState = {
    guides: [],
    filter: null,
    filteredGuides: []
};
