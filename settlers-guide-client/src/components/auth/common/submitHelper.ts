import { Dispatch } from "react";
import { _PASSWORD_MIN_LENGTH_ } from "../../../assets/consts";

export const modalError = {
    emailIncorrect: "E-mail nieprawidłowy",
    emailEmpty: "E-mail nie może być pusty",
    passwordIncorrect:
        "Hasło musi zawierać conajmniej 1 dużą literę, 1 cyfrę oraz znak specjalny",
    passwordEmpty: "Hasło nie może być puste",
};

export const isValidEmail = (email: string): string => {
    const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return "Nieprawidłowy adres email";
    }

    return "";
};
export const isValidPassword = (password: string): string => {
    if (password.length < _PASSWORD_MIN_LENGTH_) {
        return "Hasło musi mieć minimum 6 znaków";
    }

    const strongPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
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
