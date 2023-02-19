import { Alert, Button, Col, Row } from "react-bootstrap";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Form from "react-bootstrap/Form";
import React, { useReducer } from "react";
import ReactModal from "react-modal";
import ModalProps from "../../types/ModalProps";
import userReducer from "./common/UserReducer";
import {
    isValidEmail,
    isValidPassword,
    modalError,
} from "./common/submitHelper";

const LoginMutation = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

interface ErrorMessages {
    email: {
        empty: string;
        incorrect: string;
    };
    password: {
        empty: string;
        incorrect: string;
    };
}

const getErrorInfo = (
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
    };

    const errorType = stateName + "Error";
    if (stateName === "email" || stateName === "password") {
        const errorMessage = !value.length
            ? errorMessages[stateName].empty
            : errorValidation;
        return { errorType, errorMessage };
    }
    return { errorType, errorMessage: "" };
};

export const Login: React.FC<ModalProps> = ({ isOpen, onClickToggle }) => {
    const [execLogin] = useMutation(LoginMutation);

    const [
        {
            email,
            emailError,
            password,
            passwordError,
            resultMsg,
            isSubmitDisabled,
        },
        dispatch,
    ] = useReducer(userReducer, {
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        resultMsg: "",
        isSubmitDisabled: true,
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stateName = e.target.name;
        const { value } = e.target;
        dispatch({ type: stateName, payload: value });
        validateInput(stateName, value);
    };

    const validateInput = (stateName: string, value: string): void => {
        const checkValidation =
            stateName === "email" ? isValidEmail : isValidPassword;
        const errorValidation: string = checkValidation(value);

        const { errorType, errorMessage } = getErrorInfo(
            stateName,
            value,
            errorValidation
        );

        const secondValue = stateName === "email" ? passwordError : emailError;
        dispatch({ type: errorType, payload: errorMessage });

        dispatch({
            type: "isSubmitDisabled",
            payload: !errorValidation && !secondValue,
        });
    };

    const onClickCancel = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        onClickToggle(e);
    };

    const handleOnSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        const result = await execLogin({
            variables: {
                email,
                password,
            },
        });
        console.log(result);
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
                {resultMsg && <Alert variant="danger">{resultMsg}</Alert>}
                <Form.Group className="col-xs-12" controlId="formBasicUsername">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleOnChange}
                        isValid={!emailError}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {emailError}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-xs-12" controlId="formBasicPassword">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control
                        name="password"
                        type="password"
                        value={password}
                        onChange={handleOnChange}
                        isValid={!passwordError}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {passwordError}
                    </Form.Control.Feedback>
                </Form.Group>
                <Row className="mt-2">
                    <Col xs={6}>
                        <Button
                            variant="success"
                            onClick={handleOnSubmit}
                            disabled={!isSubmitDisabled}
                            style={{ width: "100%" }}
                        >
                            Zaloguj
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            variant="danger"
                            onClick={onClickCancel}
                            style={{ width: "100%" }}
                        >
                            Anuluj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </ReactModal>
    );
};
