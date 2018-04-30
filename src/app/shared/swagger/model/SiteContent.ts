import * as models from './models';
import { Content } from './Content'
export interface SiteContent {
    regionKey?: string;

    name?: string;

    description?: string;

    imageUrl?: string;

    contents?: Array<Content>;

    key?: string;

    contentKeys?: Array<string>
}