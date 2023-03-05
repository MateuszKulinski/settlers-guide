import { QueryOneResult } from "../graphql/QueryArrayResult";
import { General } from "../models/General";
import { GeneralUpgrade } from "../models/GeneralUpgrade";
import { GeneralUpgradeType } from "../models/GeneralUpgradeType";

export const createGeneralUpgrade = async (
    level: number,
    upgradeTypeId: string,
    general: General
): Promise<QueryOneResult<String>> => {
    const upgradeType = await GeneralUpgradeType.findOne({
        where: {
            id: upgradeTypeId,
        },
    });

    if (!upgradeType) return { messages: ["err"] };

    const generalUpgrade = await GeneralUpgrade.create({
        level,
        upgradeType,
        general,
    }).save();

    const returnString = generalUpgrade ? "ok" : "err";
    return { messages: [returnString] };
};
