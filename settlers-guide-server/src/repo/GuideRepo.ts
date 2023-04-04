import AppDataSource from "../DataSource";
import { getUser } from "../cammon/Tools";
import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";
import { Adventure } from "../models/Adventure";
import { General } from "../models/General";
import { Guide } from "../models/Guide";

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
              .leftJoin("guide.user", "user")
              .select([
                  "guide",
                  "adventure",
                  "user.userName",
                  "image",
                  "general",
              ])
              .where({ user, id })
              .orderBy("guide.id", "ASC")
              .getMany()
        : await Guide.createQueryBuilder("guide")
              .leftJoinAndSelect("guide.adventure", "adventure")
              .leftJoinAndSelect("guide.image", "image")
              .leftJoinAndSelect("guide.generals", "general")
              .leftJoin("guide.user", "user")
              .select([
                  "guide",
                  "adventure",
                  "user.userName",
                  "image",
                  "general",
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
