import bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";
import { User } from "../models/User";
import {
    isPasswordValid,
    isValidUserName,
} from "../cammon/validators/PasswordValidator";

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

    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (!passwordMatch) {
        return {
            messages: [_USER_ERROR_INCORRECT_PASSWORD_],
        };
    }

    if (!user.confirmed) {
        return {
            messages: [_USER_ERROR_CONFIRMATION_],
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
    password: string,
    passwordConfirmation: string,
    userName: string
): Promise<UserResult> => {
    const resultPassword = isPasswordValid(password, passwordConfirmation);
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

    const trimmedUserName = userName.trim();
    const userNameErrorMsg = isValidUserName(trimmedUserName);
    if (!userNameErrorMsg) {
        return {
            messages: ["Nazwa użytkownika jest niepoprawna"],
        };
    }

    const isUserExistEmail = await User.createQueryBuilder()
        .where(`"Email" = :trimmedEmail`, { trimmedEmail })
        .getCount();

    if (isUserExistEmail) {
        return {
            messages: ["Istnieje użytkownik z takim samym adresem e-mail"],
        };
    }

    const isUserExistPassword = await User.createQueryBuilder()
        .where(`"Username" = :trimmedUserName`, { trimmedUserName })
        .getCount();
    if (isUserExistPassword) {
        return {
            messages: ["Istnieje użytkownik z taką samą nazwą użytkownika"],
        };
    }

    const userEntity = await User.create({
        email: trimmedEmail,
        password: hashedPassword,
        userName: userName,
    }).save();

    userEntity.password = "";
    return {
        user: userEntity,
    };
};

function userNotFound(email: string) {
    return _USER_ERROR_NOT_FOUND_;
}
