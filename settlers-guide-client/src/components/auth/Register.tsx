import { gql, useMutation } from "@apollo/client";
import React, { useReducer } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import ReactModal from "react-modal";
import ModalProps from "../../types/ModalProps";
import { getErrorInfo, validationFunctions } from "./common/submitHelper";
import userReducer from "./common/UserReducer";

const RegisterMutation = gql`
    mutation Mutation(
        $email: String!
        $password: String!
        $passwordConfirmation: String!
        $userName: String!
    ) {
        register(
            email: $email
            password: $password
            passwordConfirmation: $passwordConfirmation
            userName: $userName
        )
    }
`;

export const Register: React.FC<ModalProps> = ({ isOpen, onClickToggle }) => {
    const [execRegister] = useMutation(RegisterMutation);

    const [
        {
            email,
            emailError,
            password,
            passwordError,
            passwordConfirmation,
            passwordConfirmationError,
            userName,
            userNameError,
            resultMsg,
            isSubmitDisabled,
            isSubmitResponsePositive,
        },
        dispatch,
    ] = useReducer(userReducer, {
        email: "",
        emailError: "Wprowadź e-mail",
        password: "",
        passwordError: "Wprowadź hasło",
        passwordConfirmation: "",
        passwordConfirmationError: "Powtórz hasło",
        userName: "",
        userNameError: "Wprowadź nazwę użytkownika",
        resultMsg: "",
        isSubmitDisabled: true,
        isSubmitResponsePositive: false,
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stateName = e.target.name;
        const { value } = e.target;
        dispatch({ type: stateName, payload: value });
        validateInput(stateName, value);
    };

    const validateInput = (stateName: string, value: string): void => {
        if (
            stateName === "email" ||
            stateName === "password" ||
            stateName === "passwordConfirmation" ||
            stateName === "userName"
        ) {
            const checkValidation = validationFunctions[stateName];
            const errorValidation: string = checkValidation(value);
            const { errorType, errorMessage } = getErrorInfo(
                stateName,
                value,
                errorValidation
            );

            dispatch({ type: errorType, payload: errorMessage });

            const errorsState = {
                email: emailError,
                password: passwordError,
                passwordConfirmation: passwordConfirmationError,
                userName: userNameError,
            };

            let errors = { ...errorsState, [stateName]: errorMessage };
            if (!errorMessage) {
                if (stateName.includes("password")) {
                    const passwordError = "Hasła nie są takie same";
                    switch (stateName) {
                        case "password":
                            if (passwordConfirmation !== value) {
                                errors = {
                                    ...errorsState,
                                    [stateName]: passwordError,
                                };
                                dispatch({
                                    type: errorType,
                                    payload: `${passwordError} ${
                                        errorMessage ? ", " + errorMessage : ""
                                    }`,
                                });
                            } else {
                                dispatch({
                                    type: "passwordConfirmationError",
                                    payload: ``,
                                });
                            }
                            break;

                        case "passwordConfirmation":
                            if (password !== value) {
                                errors = {
                                    ...errorsState,
                                    [stateName]: passwordError,
                                };
                                dispatch({
                                    type: errorType,
                                    payload: `${passwordError} ${
                                        errorMessage ? ", " + errorMessage : ""
                                    }`,
                                });
                            } else {
                                dispatch({
                                    type: "passwordError",
                                    payload: ``,
                                });
                            }
                            break;
                    }
                }
            }

            const isErrorsStateEmpty = Object.values(errors).every(
                (value) => value === ""
            );

            dispatch({
                type: "isSubmitDisabled",
                payload: isErrorsStateEmpty,
            });
        }
    };

    const onClickCancel = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        onClickToggle(e);
        dispatch({ type: "isSubmitResponsePositive", payload: false });
    };

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        try {
            const result = await execRegister({
                variables: {
                    email,
                    password,
                    passwordConfirmation,
                    userName,
                },
            });

            if (result.data.register === "Zarejestrowano użytkownika") {
                dispatch({ type: "isSubmitResponsePositive", payload: true });
            }
            dispatch({ type: "resultMsg", payload: result.data.register });
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <ReactModal
            className="modal-menu"
            isOpen={isOpen}
            onRequestClose={onClickToggle}
            shouldCloseOnOverlayClick={true}
            ariaHideApp={false}
        >
            <Form>
                {resultMsg && (
                    <Alert
                        variant={
                            isSubmitResponsePositive ? "success" : "danger"
                        }
                    >
                        {resultMsg}
                    </Alert>
                )}
                {!isSubmitResponsePositive ? (
                    <>
                        <Form.Group>
                            <Form.Label>
                                E-mail
                                <Form.Control
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleOnChange}
                                    isValid={!emailError}
                                ></Form.Control>
                            </Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Nazwa użytkownika
                                <Form.Control
                                    name="userName"
                                    type="text"
                                    value={userName}
                                    onChange={handleOnChange}
                                    isValid={!userNameError}
                                ></Form.Control>
                            </Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {userNameError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-xs-12">
                            <Form.Label>
                                Hasło
                                <Form.Control
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={handleOnChange}
                                    isValid={!passwordError}
                                ></Form.Control>
                            </Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {passwordError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-xs-12">
                            <Form.Label>
                                Powtórz hasło
                                <Form.Control
                                    name="passwordConfirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={handleOnChange}
                                    isValid={!passwordConfirmationError}
                                ></Form.Control>
                            </Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {passwordConfirmationError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="mt-2">
                            <Col xs={6}>
                                <Button
                                    variant="danger"
                                    onClick={onClickCancel}
                                    style={{ width: "100%" }}
                                >
                                    Anuluj
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    variant="success"
                                    onClick={handleOnSubmit}
                                    style={{ width: "100%" }}
                                >
                                    Zarejestruj
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <Col xs={12}>
                        <Button
                            variant="success"
                            onClick={onClickCancel}
                            style={{ width: "100%" }}
                        >
                            Zamknij
                        </Button>
                    </Col>
                )}
            </Form>
        </ReactModal>
    );
};
