import { QueryArrayResult } from "../graphql/QueryArrayResult";
import { GeneralType } from "../models/GeneralType";

export const getGeneralTypes = async (): Promise<
    QueryArrayResult<GeneralType>
> => {
    const generalTypes = await GeneralType.find();
    if (!generalTypes || generalTypes.length === 0) {
        return {
            messages: ["Brak typów generała."],
        };
    }

    return {
        entities: generalTypes,
    };
};
