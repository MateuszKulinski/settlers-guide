export const _PASSWORD_MIN_LENGTH_ = 6;

export interface PasswordTestResult {
    message: string;
    isValid: boolean;
}

export const isPasswordValid = (password: string): PasswordTestResult => {
    const passwordTestResult: PasswordTestResult = {
        message: "",
        isValid: true,
    };

    if (password.length < _PASSWORD_MIN_LENGTH_) {
        passwordTestResult.message = "Hasło musi mieć minimum 6 znaków";
        passwordTestResult.isValid = false;
        return passwordTestResult;
    }

    const strongPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

    if (!strongPassword.test(password)) {
        passwordTestResult.message =
            "Hasło musi zawierać conajmniej 1 dużą literę, 1 cyfrę oraz znak specjalny";
        passwordTestResult.isValid = false;
        return passwordTestResult;
    }

    return passwordTestResult;
};
