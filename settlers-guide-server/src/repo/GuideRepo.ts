import AppDataSource from "../DataSource";
import { getUser } from "../cammon/Tools";
import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";
import { Adventure } from "../models/Adventure";
import { General } from "../models/General";
import { Guide } from "../models/Guide";
import { GuideAttack } from "../models/GuideAttack";

export const saveAttack = async (
    attackId: string,
    opponentsJson: string,
    armyJson: string,
    guideId: string,
    camp: number,
    garrison: number,
    description: string,
    userId: string
): Promise<QueryOneResult<boolean>> => {
    let attack: GuideAttack | null;
    const guide = await Guide.findOne({
        where: {
            id: guideId,
            user: {
                id: userId,
            },
        },
    });

    if (!guide)
        return {
            messages: ["Brak poradnika lub poradnik nie należy do Ciebie"],
        };

    if (attackId) {
        console.log(attackId);
        attack = await GuideAttack.findOne({
            where: {
                id: attackId,
            },
        });
        if (!attack) return { messages: ["Nie znaleziono ataku"] };
        attack.opponents = opponentsJson;
        attack.army = armyJson;
        attack.camp = camp;
        attack.garrison = garrison;
        attack.description = description;

        attack.save();
    } else {
        attack = await GuideAttack.create({
            army: armyJson,
            opponents: opponentsJson,
            camp,
            garrison,
            description,
            guide,
        }).save();
    }
    console.log(attack);
    return { entity: true };
};

export const addGuide = async (
    userId: string,
    name: string,
    description: string,
    type: number,
    adventureId: string
): Promise<QueryOneResult<Guide>> => {
    const adventure = await Adventure.findOne({
        where: {
            id: adventureId,
        },
    });

    const user = await getUser(userId);

    if (!adventure || !user) return { messages: ["Błąd dodawania poradnika"] };
    let guide: Guide | null;
    guide = await Guide.create({
        name,
        description,
        user,
        type,
        adventure,
    }).save();

    if (!guide) {
        return { messages: ["Błąd dodawania generała"] };
    }

    return {
        entity: guide,
    };
};

export const deleteGuide = async (
    guideId: string,
    userId: string
): Promise<boolean> => {
    const guide = await Guide.createQueryBuilder("guide")
        .leftJoinAndSelect("guide.user", "user")
        .where("guide.id = :guideId", { guideId })
        .andWhere("user.id = :userId", { userId })
        .getOne();

    if (guide) {
        guide.remove();
        return true;
    }
    return false;
};

export const getGuides = async (
    id: string,
    userId: string
): Promise<QueryArrayResult<Guide>> => {
    const user = await getUser(userId);

    const guides = id
        ? await Guide.createQueryBuilder("guide")
              .leftJoinAndSelect("guide.adventure", "adventure")
              .leftJoinAndSelect("guide.image", "image")
              .leftJoinAndSelect("guide.generals", "general")
              .leftJoinAndSelect("guide.attacks", "guideAttack")
              .leftJoin("guide.user", "user")
              .select([
                  "guide",
                  "adventure",
                  "user.userName",
                  "image",
                  "general",
                  "guideAttack",
              ])
              .where({ user, id })
              .orderBy("guide.id", "ASC")
              .getMany()
        : await Guide.createQueryBuilder("guide")
              .leftJoinAndSelect("guide.adventure", "adventure")
              .leftJoinAndSelect("guide.image", "image")
              .leftJoinAndSelect("guide.generals", "general")
              .leftJoinAndSelect("guide.attacks", "guideAttack")
              .leftJoin("guide.user", "user")
              .select([
                  "guide",
                  "adventure",
                  "user.userName",
                  "image",
                  "general",
                  "guideAttack",
              ])
              .where({ user })
              .orderBy("guide.id", "ASC")
              .getMany();

    if (!guides || guides.length === 0)
        return { messages: ["Nie można pobrać poradników"] };

    return {
        entities: guides,
    };
};

export const saveGuide = async (
    guideId: string,
    userId: string,
    description: string | undefined,
    type: number | undefined
): Promise<QueryOneResult<boolean>> => {
    const guide = await Guide.findOne({
        where: {
            id: guideId,
            user: {
                id: userId,
            },
        },
    });

    if (!guide) return { messages: ["Nie można pobrać poradników"] };

    if (description) guide.description = description;

    if (type !== undefined) {
        guide.type = type;
    }

    guide.save();
    return { entity: true };
};

export const saveGuideGeneral = async (
    generalId: string,
    guideId: string,
    checked: boolean,
    userId: string
): Promise<QueryOneResult<boolean>> => {
    const guide = await Guide.findOne({
        where: {
            id: guideId,
            user: {
                id: userId,
            },
        },
        relations: ["generals"],
    });

    if (!guide) return { messages: ["Nie można pobrać poradników"] };

    const general = await General.findOne({
        where: [
            {
                id: generalId,
                user: {
                    id: userId,
                },
            },
            {
                id: generalId,
                public: true,
            },
        ],
    });

    if (!(general instanceof General))
        return { messages: ["Nie jesteś właścicielem generała"] };

    if (checked) {
        guide.generals = guide.generals.length
            ? [...guide.generals, general]
            : [general];
        guide.save();
        return { entity: true };
    }
    await AppDataSource.createQueryBuilder()
        .delete()
        .from("GuideGeneral")
        .where("guideId = :guideId AND generalId = :generalId", {
            guideId,
            generalId,
        })
        .execute();
    return { entity: true };
};
