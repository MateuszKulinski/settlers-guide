import { QueryArrayResult } from "../graphql/QueryArrayResult";
import { Bandit } from "../models/Bandit";

export const getBandits = async (
    id?: string
): Promise<QueryArrayResult<Bandit>> => {
    const bandits = await Bandit.find({
        where: id ? { id: id } : {},
    });

    if (!bandits || bandits.length == 0)
        return { messages: ["Brak jednostek bandytów"] };
    return {
        entities: bandits,
    };
};
