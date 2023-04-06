import { QueryArrayResult } from "../graphql/QueryArrayResult";
import { Unit } from "../models/Unit";

export const getUnits = async (
    id?: string
): Promise<QueryArrayResult<Unit>> => {
    const units = await Unit.find({
        where: id ? { id: id } : {},
    });

    if (!units || units.length == 0) return { messages: ["Brak jednostek"] };
    return {
        entities: units,
    };
};
