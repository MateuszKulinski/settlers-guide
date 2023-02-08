import { User } from "../models/User";

export class UserResult {
    constructor(public messages?: Array<string>, public user?: User) {}
}

export const me = async (id: string): Promise<UserResult> => {
    return {
        messages: ["TEST"],
    };
};
