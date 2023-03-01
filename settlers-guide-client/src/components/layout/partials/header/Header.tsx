import {
    faHeart,
    faHomeAlt,
    faPlus,
    faRegistered,
    faSignInAlt,
    faSignOutAlt,
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
import { gql, useMutation } from "@apollo/client";
import useRefreshMe, { Me } from "../../../../hooks/useRefreshMe";

const LogoutMutation = gql`
    mutation logout($email: String!) {
        logout(email: $email)
    }
`;

export const Header: React.FC = () => {
    const [execLogout] = useMutation(LogoutMutation, {
        refetchQueries: [{ query: Me }],
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const { width } = useWindowDimensions();
    const user = useSelector((state: AppState) => state.user);
    const { deleteMe } = useRefreshMe(false);

    const onClickToggleLogin = () => {
        setShowLoginModal(!showLoginModal);
    };

    const handleLogout = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        await execLogout({
            variables: {
                email: user?.email ?? "",
            },
        });
        window.location.reload();
        deleteMe();
    };

    const onClickToggleRegister = () => {
        setShowRegisterModal(!showRegisterModal);
    };

    const userNameContent = user ? (
        <div className="container-username">
            Witaj {user.userName}!
            <Button variant="outline-light" onClick={handleLogout}>
                <FontAwesomeIcon className="me-2" icon={faSignOutAlt} />
                Wyloguj
            </Button>
        </div>
    ) : (
        ""
    );

    const getAuthButtons = () => {
        if (width > _WIDTH_MOBILE_) {
            return (
                <>
                    {user ? (
                        userNameContent
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
        return userNameContent;
    };

    const getMobileAuthButtons = () => {
        if (width <= _WIDTH_MOBILE_) {
            return (
                <>
                    {!user && (
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

    return (
        <>
            <Navbar className="bg-gold p-2" expand="md" fixed="top">
                <Navbar.Toggle type="button" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/" className="text-light">
                            <FontAwesomeIcon
                                className="me-2"
                                icon={faHomeAlt}
                            />
                            HOME
                        </Nav.Link>
                        {user && (
                            <>
                                <Nav.Link href="#" className="text-light">
                                    <FontAwesomeIcon
                                        className="me-2"
                                        icon={faHeart}
                                    />
                                    Ulubione
                                </Nav.Link>
                                <Nav.Link href="/dodaj" className="text-white">
                                    <FontAwesomeIcon
                                        className="me-2"
                                        icon={faPlus}
                                    />
                                    Dodaj poradnik
                                </Nav.Link>
                            </>
                        )}
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
