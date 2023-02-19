const userReducer = (state: any, action: any) => {
    switch (action.type) {
        case "email":
            return { ...state, email: action.payload };
        case "emailError":
            return { ...state, emailError: action.payload };
        case "password":
            return { ...state, password: action.payload };
        case "passwordError":
            return { ...state, passwordError: action.payload };
        case "passwordConfirmation":
            return { ...state, passwordConfirmation: action.payload };
        case "passwordConfirmationError":
            return { ...state, passwordConfirmationError: action.payload };
        case "resultMsg":
            return { ...state, resultMsg: action.payload };
        case "isSubmitDisabled":
            return { ...state, isSubmitDisabled: action.payload };
        default:
            return {
                ...state,
                resultMsg: "Błąd. Skontaktuj się z administatorem strony",
            };
    }
};

export default userReducer;
