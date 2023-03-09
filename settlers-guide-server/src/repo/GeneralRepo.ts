import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";
import { General } from "../models/General";
import { GeneralType } from "../models/GeneralType";
import { User } from "../models/User";

export const getGenerals = async (
    id: string,
    userId: string
): Promise<QueryArrayResult<General>> => {
    const user = await User.findOne({
        where: {
            id: userId,
        },
    });
    console.log("TEST");
    console.log("AAA");
    console.log(id);
    const generals = id
        ? await General.createQueryBuilder("general")
              .leftJoinAndSelect("general.upgrades", "generalUpgrade")
              .leftJoinAndSelect(
                  "generalUpgrade.upgradeType",
                  "generalUpgradeType"
              )
              .leftJoinAndSelect("general.generalType", "generalType")
              //   .where("general.id = :id AND general.user = :user", {
              //       id: id,
              //       user: user,
              //   })

              .where({ user, id })
              .getMany()
        : await General.createQueryBuilder("general")
              .leftJoinAndSelect("general.upgrades", "generalUpgrade")
              .leftJoinAndSelect(
                  "generalUpgrade.upgradeType",
                  "generalUpgradeType"
              )
              .leftJoinAndSelect("general.generalType", "generalType")
              .where({ user })
              .getMany();
    console.log(generals);
    if (!generals || generals.length === 0) {
        return { messages: ["Nie można pobrać generałów"] };
    }

    return {
        entities: generals,
    };
};

export const createGeneral = async (
    userId: string,
    name: string,
    type: string
): Promise<QueryOneResult<General>> => {
    const generalType = await GeneralType.findOne({
        where: {
            id: type,
        },
    });

    const user = await User.findOne({
        where: {
            id: userId,
        },
    });

    if (!generalType || !user) return { messages: ["Błąd dodawania generała"] };

    const general = await General.create({
        name,
        generalType,
        user,
    }).save();

    if (!general) {
        return { messages: ["Błąd dodawania generała"] };
    }

    return {
        entity: general,
    };
};
