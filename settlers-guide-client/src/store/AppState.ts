import { combineReducers } from "redux";
import { AdventureCategoriesReducer } from "./categories/Reducer";
import { UserProfileReducer } from "./user/Reducer";

export const rootReducer = combineReducers({
    user: UserProfileReducer,
    categories: AdventureCategoriesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
