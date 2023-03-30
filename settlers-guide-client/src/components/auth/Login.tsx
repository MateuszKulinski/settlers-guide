import { Alert, Button, Col, Row } from "react-bootstrap";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Form from "react-bootstrap/Form";
import React, { useReducer } from "react";
import ReactModal from "react-modal";
import ModalProps from "../../types/ModalProps";
import userReducer from "./common/UserReducer";
import {
    getErrorInfo,
    isValidEmail,
    isValidPassword,
} from "./common/submitHelper";
import useRefreshMe, { Me } from "../../hooks/useRefreshMe";

const LoginMutation = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

export const Login: React.FC<ModalProps> = ({ isOpen, onClickToggle }) => {
    const [execLogin] = useMutation(LoginMutation, {
        refetchQueries: [
            {
                query: Me,
            },
        ],
    });
    const { execMe } = useRefreshMe(true);

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
        emailError: "Wprowadź e-mail",
        password: "",
        passwordError: "Wprowadź hasło",
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
        if (result.data.login === "Zalogowano użytkownika") {
            onClickToggle(e);
            execMe();
        }
        dispatch({ type: "resultMsg", payload: result.data.login });
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
                <Form.Group className="col-xs-12">
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
                <Form.Group className="col-xs-12">
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
                            disabled={!isSubmitDisabled}
                            style={{ width: "100%" }}
                        >
                            Zaloguj
                        </Button>
                    </Col>
                </Row>
            </Form>
        </ReactModal>
    );
};
