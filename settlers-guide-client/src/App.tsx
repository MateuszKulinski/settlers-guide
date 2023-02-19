import { Header } from "./components/layout/partials/header/Header";
import Main from "./components/Main/Main";
import React from "react";
import "./App.css";

const App: React.FC = () => {
    return (
        <>
            <Header />
            <Main />
        </>
    );
};

export default App;
