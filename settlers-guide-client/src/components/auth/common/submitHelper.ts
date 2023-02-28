import { Dispatch } from "react";
import {
    _PASSWORD_MIN_LENGTH_,
    _USERNAME_MIN_LENGTH_,
} from "../../../assets/consts";

export const modalError = {
    emailIncorrect: "E-mail nieprawidłowy",
    emailEmpty: "E-mail nie może być pusty",
    passwordIncorrect:
        "Hasło musi zawierać conajmniej 1 dużą literę, 1 cyfrę oraz znak specjalny",
    passwordEmpty: "Hasło nie może być puste",
};

export const isValidEmail = (email: string): string => {
    console.log(email);
    const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email) || email.length < 5) {
        return "Nieprawidłowy adres email";
    }

    return "";
};

export const isValidUserName = (userName: string): string => {
    if (userName.length < _USERNAME_MIN_LENGTH_) {
        return `Nazwa użytkownika musi mieć minimum ${_USERNAME_MIN_LENGTH_} znaków`;
    }

    return "";
};

export const isValidPassword = (password: string): string => {
    if (password.length < _PASSWORD_MIN_LENGTH_) {
        return `Hasło musi mieć minimum ${_PASSWORD_MIN_LENGTH_} znaków`;
    }

    const strongPassword = new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{${_PASSWORD_MIN_LENGTH_},})`
    );

    if (!strongPassword.test(password)) {
        return "Hasło musi zawierać conajmniej 1 dużą literę, 1 cyfrę oraz znak specjalny";
    }

    return "";
};

export const allowSubmit = (
    dispatch: Dispatch<any>,
    msg: string,
    setDisabled: boolean
) => {
    dispatch({ type: "isSubmitDisabled", payload: setDisabled });
    dispatch({ type: "resultMsg", payload: msg });
};

interface ErrorMessages {
    email: {
        empty: string;
        incorrect: string;
    };
    password: {
        empty: string;
        incorrect: string;
    };
    passwordConfirmation: {
        empty: string;
        incorrect: string;
    };
    userName: {
        empty: string;
        incorrect: string;
    };
}

export const getErrorInfo = (
    stateName: string,
    value: string,
    errorValidation: string
) => {
    const errorMessages: ErrorMessages = {
        email: {
            empty: modalError.emailEmpty,
            incorrect: modalError.emailIncorrect,
        },
        password: {
            empty: modalError.passwordEmpty,
            incorrect: modalError.passwordIncorrect,
        },
        passwordConfirmation: {
            empty: modalError.passwordEmpty,
            incorrect: modalError.passwordIncorrect,
        },
        userName: {
            empty: modalError.passwordEmpty,
            incorrect: modalError.passwordIncorrect,
        },
    };

    const errorType = stateName + "Error";
    if (
        stateName === "email" ||
        stateName === "password" ||
        stateName === "passwordConfirmation" ||
        stateName === "userName"
    ) {
        const errorMessage = !value.length
            ? errorMessages[stateName].empty
            : errorValidation;
        return { errorType, errorMessage };
    }
    return { errorType, errorMessage: "" };
};

interface ValidationFunctions {
    email: (value: string) => any;
    password: (value: string) => any;
    passwordConfirmation: (value: string) => any;
    userName: (value: string) => any;
}

export const validationFunctions: ValidationFunctions = {
    email: (value: string) => isValidEmail(value),
    password: (value: string) => isValidPassword(value),
    passwordConfirmation: (value: string) => isValidPassword(value),
    userName: (value: string) => isValidUserName(value),
};
