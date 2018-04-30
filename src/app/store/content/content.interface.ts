import { Content } from '../../shared/swagger/model/Content';

export interface ContentState {
    content: Array<Content>;
    filter: string;
    filteredContent: Array<Content>;
}

export const initialState: ContentState = {
    content: [],
    filter: null,
    filteredContent: []
};
