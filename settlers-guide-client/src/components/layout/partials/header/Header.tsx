import {
    faRegistered,
    faSignInAlt,
    faHomeAlt,
    faHeart,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { _WIDTH_MOBILE_ } from "../../../../assets/consts";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import "./Header.css";

export const Header: React.FC = () => {
    const { width } = useWindowDimensions();

    const getMobileAuthButtons = () => {
        if (width <= _WIDTH_MOBILE_) {
            return (
                <>
                    <Nav.Link className="text-light">
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

    const getAuthButtons = () => {
        if (width > _WIDTH_MOBILE_) {
            return (
                <Nav>
                    <Button variant="outline-light">
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
        <Navbar className="bg-gold p-2" expand="md" fixed="top">
            <Navbar.Toggle type="button" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#" className="text-light">
                        <FontAwesomeIcon className="me-2" icon={faHomeAlt} />
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
    );
};
