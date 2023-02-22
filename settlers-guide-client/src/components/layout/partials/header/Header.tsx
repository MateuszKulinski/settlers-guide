import {
    faHeart,
    faHomeAlt,
    faPlus,
    faRegistered,
    faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Nav, Navbar } from "react-bootstrap";
import React, { useState } from "react";
import { _WIDTH_MOBILE_ } from "../../../../assets/consts";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { Login } from "../../../auth/Login";
import "./Header.css";
import { Register } from "../../../auth/Register";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store/AppState";

export const Header: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const { width } = useWindowDimensions();
    const user = useSelector((state: AppState) => state.user);

    const getMobileAuthButtons = () => {
        if (width <= _WIDTH_MOBILE_) {
            return (
                <>
                    {user ? (
                        user.userName
                    ) : (
                        <>
                            <Nav.Link
                                className="text-light"
                                onClick={onClickToggleLogin}
                            >
                                <FontAwesomeIcon
                                    className="me-2"
                                    icon={faSignInAlt}
                                />
                                Zaloguj
                            </Nav.Link>
                            <Nav.Link className="text-light">
                                <FontAwesomeIcon
                                    className="me-2"
                                    icon={faRegistered}
                                />
                                Zarejestruj
                            </Nav.Link>
                        </>
                    )}
                </>
            );
        }
        return null;
    };

    const onClickToggleLogin = () => {
        setShowLoginModal(!showLoginModal);
    };

    const onClickToggleRegister = () => {
        setShowRegisterModal(!showRegisterModal);
    };

    const getAuthButtons = () => {
        if (width > _WIDTH_MOBILE_) {
            return (
                <>
                    {user ? (
                        user.userName
                    ) : (
                        <>
                            <Nav>
                                <Button
                                    variant="outline-light"
                                    onClick={onClickToggleLogin}
                                >
                                    <FontAwesomeIcon
                                        className="me-2"
                                        icon={faSignInAlt}
                                    />
                                    Zaloguj
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={onClickToggleRegister}
                                >
                                    <FontAwesomeIcon
                                        className="me-2"
                                        icon={faRegistered}
                                    />
                                    Zarejestruj
                                </Button>
                            </Nav>
                        </>
                    )}
                </>
            );
        }
        return null;
    };

    console.log(user);

    return (
        <>
            <Navbar className="bg-gold p-2" expand="md" fixed="top">
                <Navbar.Toggle type="button" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#" className="text-light">
                            <FontAwesomeIcon
                                className="me-2"
                                icon={faHomeAlt}
                            />
                            HOME
                        </Nav.Link>
                        <Nav.Link href="#" className="text-light">
                            <FontAwesomeIcon className="me-2" icon={faHeart} />
                            Ulubione
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            <FontAwesomeIcon className="me-2" icon={faPlus} />
                            Dodaj poradnik
                        </Nav.Link>
                        {getMobileAuthButtons()}
                    </Nav>
                </Navbar.Collapse>
                {getAuthButtons()}
            </Navbar>
            <Login isOpen={showLoginModal} onClickToggle={onClickToggleLogin} />
            <Register
                isOpen={showRegisterModal}
                onClickToggle={onClickToggleRegister}
            />
        </>
    );
};
