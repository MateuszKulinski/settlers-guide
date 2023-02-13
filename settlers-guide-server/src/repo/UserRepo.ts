import { User } from "../models/User";

export class UserResult {
    constructor(public messages?: Array<string>, public user?: User) {}
}

export const me = async (id: string): Promise<UserResult> => {
    return {
        messages: ["TEST"],
    };
};

export const register = async (email: string, password: string) => {
    return {
        messages: ["TEST"],
    };
};

export const login = async (email: string, password: string) => {
    return {
        messages: ["TEST"],
    };
};

export const logout = async (email: string): Promise<string> => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        return userNotFound(email);
    }

    return "User logged off.";
};

function userNotFound(userName: string) {
    return `User with userName ${userName} not found.`;
}
