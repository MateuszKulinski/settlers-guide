import bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";

import { User } from "../models/User";
import { isPasswordValid } from "../cammon/validators/PasswordValidator";

const _SALT_ROUNDS_ = 10;
const _USER_ERROR_CONFIRMATION_ =
    "Użykownik nie potwierdził swojego adresu e-mail.";
const _USER_ERROR_INCORRECT_PASSWORD_ = "Hasło jest nieprawidłowe.";
const _USER_ERROR_NOT_FOUND_ = "Użytkownik nie został znaleziony.";
export class UserResult {
    constructor(public messages?: Array<string>, public user?: User) {}
}

export const changePassword = async (
    id: string,
    newPassword: string,
    oldPassword: string
): Promise<string> => {
    const user = await User.findOne({
        where: { id },
    });

    if (!user) {
        return _USER_ERROR_NOT_FOUND_;
    }

    if (!user.confirmed) {
        _USER_ERROR_CONFIRMATION_;
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user?.password);
    if (!passwordMatch) {
        return _USER_ERROR_INCORRECT_PASSWORD_;
    }

    const salt = await bcrypt.genSalt(_SALT_ROUNDS_);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.save();
    return "Hasło zostało zmienione";
};

export const login = async (
    email: string,
    password: string
): Promise<UserResult> => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        return {
            messages: [userNotFound(email)],
        };
    }

    if (!user.confirmed) {
        return {
            messages: [_USER_ERROR_CONFIRMATION_],
        };
    }

    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (!passwordMatch) {
        return {
            messages: [_USER_ERROR_INCORRECT_PASSWORD_],
        };
    }

    return {
        user: user,
    };
};

export const logout = async (email: string): Promise<string> => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        return userNotFound(email);
    }

    return "Użytkownik został wylogowany.";
};

export const me = async (id: string): Promise<UserResult> => {
    const user = await User.findOne({
        where: { id },
    });

    if (!user) {
        return {
            messages: [_USER_ERROR_NOT_FOUND_],
        };
    }

    if (!user.confirmed) {
        return {
            messages: [],
        };
    }
    user.password = "";

    return {
        user,
    };
};

export const register = async (
    email: string,
    password: string
): Promise<UserResult> => {
    const resultPassword = isPasswordValid(password);
    if (!resultPassword.isValid) {
        return {
            messages: [resultPassword.message],
        };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailErrorMsg = EmailValidator.validate(email);
    if (!emailErrorMsg) {
        return {
            messages: ["Adres e-mail jest niepoprawny"],
        };
    }

    const salt = await bcrypt.genSalt(_SALT_ROUNDS_);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userEntity = await User.create({
        email: trimmedEmail,
        password: hashedPassword,
    }).save();

    userEntity.password = "";
    return {
        user: userEntity,
    };
};

function userNotFound(email: string) {
    return _USER_ERROR_NOT_FOUND_;
}
