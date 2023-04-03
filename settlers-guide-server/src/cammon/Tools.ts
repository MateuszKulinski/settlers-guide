import { User } from "../models/User";

export const getUser = async (id: string) => {
    return await User.findOne({
        where: {
            id,
        },
    });
};
