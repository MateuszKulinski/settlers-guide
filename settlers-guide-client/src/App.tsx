import { Header } from "./components/layout/partials/header/Header";
import Main from "./components/Main/Main";
import React, { useEffect } from "react";
import "./App.css";
import useRefreshMe from "./hooks/useRefreshMe";
import { useDispatch } from "react-redux";

const App: React.FC = () => {
    const { execMe } = useRefreshMe(true);

    useEffect(() => {
        execMe();
    }, [execMe]);

    return (
        <>
            <Header />
            <Main />
        </>
    );
};

export default App;
