import AdventureCategory from "../../model/AdventureCategory";

export const AdventureCategorySetType = "ADVENTURE_SET";

export interface AdventureCategoryAction {
    type: string;
    payload: Array<AdventureCategory> | null;
}

export const AdventureCategoriesReducer = (
    state: any = null,
    action: AdventureCategoryAction
): Array<AdventureCategory> | null => {
    switch (action.type) {
        case AdventureCategorySetType:
            return action.payload;
        default:
            return state;
    }
};
