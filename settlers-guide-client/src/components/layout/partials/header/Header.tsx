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

export const Header: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { width } = useWindowDimensions();

    const getMobileAuthButtons = () => {
        if (width <= _WIDTH_MOBILE_) {
            return (
                <>
                    <Nav.Link
                        className="text-light"
                        onClick={onClickToggleLogin}
                    >
                        <FontAwesomeIcon className="me-2" icon={faSignInAlt} />
                        Zaloguj
                    </Nav.Link>
                    <Nav.Link className="text-light">
                        <FontAwesomeIcon className="me-2" icon={faRegistered} />
                        Zarejestruj
                    </Nav.Link>
                </>
            );
        }
        return null;
    };

    const onClickToggleLogin = () => {
        setShowLoginModal(!showLoginModal);
    };

    const getAuthButtons = () => {
        if (width > _WIDTH_MOBILE_) {
            return (
                <Nav>
                    <Button
                        variant="outline-light"
                        onClick={onClickToggleLogin}
                    >
                        <FontAwesomeIcon className="me-2" icon={faSignInAlt} />
                        Zaloguj
                    </Button>
                    <Button variant="light">
                        <FontAwesomeIcon className="me-2" icon={faRegistered} />
                        Zarejestruj
                    </Button>
                </Nav>
            );
        }
        return null;
    };

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
        </>
    );
};
