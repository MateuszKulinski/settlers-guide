import { QueryOneResult } from "../graphql/QueryArrayResult";
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
