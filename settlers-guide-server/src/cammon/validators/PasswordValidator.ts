export const _PASSWORD_MIN_LENGTH_ = 6;

export interface TestResult {
    message: string;
    isValid: boolean;
}

const _USERNAME_MIN_LENGTH_ = 3;

export const isPasswordValid = (
    password: string,
    passwordConfirmation: string
): TestResult => {
    const passwordTestResult: TestResult = {
        message: "",
        isValid: true,
    };

    if (password !== passwordConfirmation) {
        passwordTestResult.message = "Hasła muszą być takie same";
        passwordTestResult.isValid = false;
        return passwordTestResult;
    }

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

export const isValidUserName = (userName: string): TestResult => {
    const userNameTestResult: TestResult = {
        message: "",
        isValid: true,
    };

    if (userName.length < _USERNAME_MIN_LENGTH_) {
        userNameTestResult.message = `Nazwa użytkownika musi mieć minimum ${_USERNAME_MIN_LENGTH_} znaków`;
        userNameTestResult.isValid = false;
    }

    return userNameTestResult;
};
