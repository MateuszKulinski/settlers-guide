import { QueryArrayResult, QueryOneResult } from "../graphql/QueryArrayResult";
import { Adventure } from "../models/Adventure";
import { Guide } from "../models/Guide";
import { User } from "../models/User";

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

    const user = await User.findOne({
        where: {
            id: userId,
        },
    });

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

export const deleteGuide = async (guideId: string, userId: string) => {
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
    const user = await User.findOne({
        where: {
            id: userId,
        },
    });
    const guides = id
        ? await Guide.createQueryBuilder("guide")
              .leftJoinAndSelect("guide.adventure", "adventure")
              .leftJoin("guide.user", "user")
              .select(["guide", "adventure", "user.userName"])
              .where({ user, id })
              .orderBy("guide.id", "ASC")
              .getMany()
        : await Guide.createQueryBuilder("guide")
              .leftJoinAndSelect("guide.adventure", "adventure")
              .leftJoin("guide.user", "user")
              .select(["guide", "adventure", "user.userName"])
              .where({ user })
              .orderBy("guide.id", "ASC")
              .getMany();

    if (!guides || guides.length === 0) {
        return { messages: ["Nie można pobrać poradników"] };
    }

    return {
        entities: guides,
    };
};
