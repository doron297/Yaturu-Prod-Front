import { Trip } from '../shared/swagger/model/Trip';
interface Item {
    key?: string;
}
export const filter = (items: Array<Item>, filterBy: string): Array<Item> => {
    return items.filter((value: Item) => {
        if (filterBy !== null && filterBy !== undefined && filterBy !== '') {
            let guideInText = JSON.stringify(value).toLowerCase();
            return (guideInText.includes(filterBy));
        }
        return true;
    });
};
export const includeOnly = (items: Array<Item>, keysToInclude: Array<string>): Array<Item> => {
    return items.filter((value: Item) => {
        return keysToInclude.includes(value.key);
    });
};
export const upsert = (items: Array<Item>, newItem: Item): Array<Item> => {
    let oldItemIndex = items.findIndex((value: Item) => {
        return value.key === newItem.key;
    });

    let isNewItem = (oldItemIndex === -1);
    if (isNewItem) {
        return items.concat(newItem);
    } else {
        return items.map((value: Item) => {
            if (value.key === newItem.key) {
                return newItem;
            }
            return value;
        });
    }
};
export const sortbyDate = (items: Array<Trip>): void => {
    items.sort((a: Trip, b: Trip) => {
        if (a.startDate > b.startDate) {
            return -1;
        } else if (a.startDate < b.startDate) {
            return 1;
        } else {
            return 0;
        }
    });
};

export const remove = (items: Array<Item>, removeItem: Item): Array<Item> => {
    return items.filter((value: Item) => {
        return (value.key !== removeItem.key);
    });
};


