import React from "react";
import "./App.css";
import { Header } from "./components/layout/partials/header/Header";
import { Container, Row, Col } from "react-bootstrap";
import Main from "./components/Main/Main";

const App = () => {
    return (
        <>
            <Header />
            <Main />
        </>
    );
};

export default App;
