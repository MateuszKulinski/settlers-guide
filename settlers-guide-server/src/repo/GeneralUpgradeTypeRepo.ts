import { QueryArrayResult } from "../graphql/QueryArrayResult";
import { GeneralUpgradeType } from "../models/GeneralUpgradeType";

export const getGeneralUpgradeTypes = async (): Promise<
    QueryArrayResult<GeneralUpgradeType>
> => {
    const generalUpgradeTypes = await GeneralUpgradeType.find({
        order: { id: "DESC" },
    });
    if (!generalUpgradeTypes || generalUpgradeTypes.length == 0) {
        return {
            messages: ["Brak typów ulepszeń generała."],
        };
    }

    return {
        entities: generalUpgradeTypes,
    };
};
