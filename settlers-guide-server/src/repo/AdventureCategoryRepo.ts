import { AdventureCategory } from "../models/AdventureCategory";
import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";

export const getAdventureCategoryById = async (
    id: string
): Promise<QueryOneResult<AdventureCategory>> => {
    const adventureCategory = await AdventureCategory.findOne({
        where: {
            id,
        },
        relations: ["adventures"],
    });

    if (!adventureCategory) {
        return {
            messages: ["Brak kategorii."],
        };
    }

    return {
        entity: adventureCategory,
    };
};

export const getAdventureCategories = async (): Promise<
    QueryArrayResult<AdventureCategory>
> => {
    const adventureCategories = await AdventureCategory.createQueryBuilder(
        "adventureCategory"
    )
        .leftJoinAndSelect("adventureCategory.adventures", "adventure")
        .getMany();
    if (!adventureCategories || adventureCategories.length == 0) {
        return {
            messages: ["Nie znaleziono kategorii"],
        };
    }

    return {
        entities: adventureCategories,
    };
};
