import { QueryOneResult } from "../graphql/QueryArrayResult";
import { General } from "../models/General";
import { GeneralUpgrade } from "../models/GeneralUpgrade";
import { GeneralUpgradeType } from "../models/GeneralUpgradeType";

export const saveGeneralUpgrade = async (
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
    const generalId = general.id;
    let generalUpgrade = await GeneralUpgrade.createQueryBuilder(
        "generalUpgrade"
    )
        .leftJoinAndSelect("generalUpgrade.upgradeType", "upgradeType")
        .leftJoinAndSelect("generalUpgrade.general", "general")
        .andWhere("general.id = :generalId", { generalId })
        .andWhere("upgradeType.id = :upgradeTypeId", { upgradeTypeId })
        .getOne();
    if (generalUpgrade) {
        generalUpgrade.level = level;
        generalUpgrade.save();
    } else {
        generalUpgrade = await GeneralUpgrade.create({
            level,
            upgradeType,
            general,
        }).save();
    }

    const returnString = generalUpgrade ? "ok" : "err";
    return { messages: [returnString] };
};
