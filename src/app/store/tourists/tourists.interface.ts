import { Tourist } from '../../shared/swagger/model/Tourist';

export interface TouristsState {
    touristMap: Map<string, Array<Tourist>>;
}

export const initialState: TouristsState = {
    touristMap: new Map<string, Array<Tourist>>(),
};
