import { getUser } from "../cammon/Tools";
import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";
import { General } from "../models/General";
import { GeneralType } from "../models/GeneralType";

export const getGenerals = async (
    id: string,
    userId: string,
    withPublic: boolean
): Promise<QueryArrayResult<General>> => {
    const user = await getUser(userId);

    let generals: General[];

    if (withPublic) {
        generals = await General.createQueryBuilder("general")
            .leftJoinAndSelect("general.upgrades", "generalUpgrade")
            .leftJoinAndSelect(
                "generalUpgrade.upgradeType",
                "generalUpgradeType"
            )
            .leftJoinAndSelect("general.generalType", "generalType")
            .where({ user })
            .orWhere("general.public = true")
            .orderBy("general.public, general.id", "ASC")
            .getMany();
    } else if (id) {
        generals = await General.createQueryBuilder("general")
            .leftJoinAndSelect("general.upgrades", "generalUpgrade")
            .leftJoinAndSelect(
                "generalUpgrade.upgradeType",
                "generalUpgradeType"
            )
            .leftJoinAndSelect("general.generalType", "generalType")
            .where({ user, id })
            .orderBy("general.id", "ASC")
            .getMany();
    } else {
        generals = await General.createQueryBuilder("general")
            .leftJoinAndSelect("general.upgrades", "generalUpgrade")
            .leftJoinAndSelect(
                "generalUpgrade.upgradeType",
                "generalUpgradeType"
            )
            .leftJoinAndSelect("general.generalType", "generalType")
            .where({ user })
            .orderBy("general.id", "ASC")
            .getMany();
    }

    if (!generals || generals.length === 0) {
        return { messages: ["Nie można pobrać generałów"] };
    }

    return {
        entities: generals,
    };
};

export const saveGeneral = async (
    userId: string,
    generalId: string | undefined,
    name: string,
    type: string
): Promise<QueryOneResult<General>> => {
    const generalType = await GeneralType.findOne({
        where: {
            id: type,
        },
    });

    const user = await getUser(userId);

    if (!generalType || !user) return { messages: ["Błąd dodawania generała"] };
    let general: General | null;
    if (generalId) {
        general = await General.findOne({
            where: {
                id: generalId,
                user: {
                    id: userId,
                },
            },
            relations: ["generalType", "user"],
        });
        if (!general) {
            return { messages: ["Nie znaleziono generała o podanym ID"] };
        }

        general.name = name;
        general.generalType = generalType;
        general.save();
    } else {
        general = await General.create({
            name,
            generalType,
            user,
        }).save();
    }

    if (!general) {
        return { messages: ["Błąd dodawania generała"] };
    }

    return {
        entity: general,
    };
};

export const deleteGeneral = async (generalId: string, userId: string) => {
    const general = await General.createQueryBuilder("general")
        .leftJoinAndSelect("general.user", "user")
        .where("general.id = :generalId", { generalId })
        .andWhere("user.id = :userId", { userId })
        .getOne();

    if (general) {
        general.remove();
        return true;
    }
    return false;
};
