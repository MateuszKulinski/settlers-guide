import { Header } from "./components/layout/partials/header/Header";
import Main from "./components/Main/Main";
import React, { useEffect } from "react";
import "./App.css";
import useRefreshMe from "./hooks/useRefreshMe";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import { AdventureCategorySetType } from "./store/categories/Reducer";
import AddGuide from "./components/AddGuide/AddGuide";
import { Route, Routes } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import {
    _URL_GENERALS_,
    _URL_HOME_,
    _URL_NEW_GENERAL_,
    _URL_NEW_GUIDE_,
} from "./assets/consts";
import AddGeneral from "./components/Generals/AddGeneral/AddGeberal";
import GeneralsList from "./components/Generals/GeneralsList";

const GetAllAdventureCategories = gql`
    query {
        getAdventureCategories {
            ... on EntityResult {
                messages
            }
            ... on AdventureCategory {
                id
                name
                adventures {
                    name
                    id
                }
            }
        }
    }
`;

const App: React.FC = () => {
    const { execMe } = useRefreshMe(true);
    const { data: categoriesData } = useQuery(GetAllAdventureCategories);

    const dispatch = useDispatch();

    useEffect(() => {
        if (categoriesData && categoriesData.getAdventureCategories) {
            dispatch({
                type: AdventureCategorySetType,
                payload: categoriesData.getAdventureCategories,
            });
        }
    });

    useEffect(() => {
        execMe();
    }, [execMe]);

    return (
        <>
            <Header />
            <Container className="container-main" fluid="md">
                <Row>
                    <Routes>
                        <Route path={_URL_HOME_} element={<Main />} />
                        <Route path={_URL_NEW_GUIDE_} element={<AddGuide />} />
                        <Route
                            path={_URL_NEW_GENERAL_}
                            element={<AddGeneral />}
                        />
                        <Route
                            path={_URL_GENERALS_}
                            element={<GeneralsList />}
                        />
                    </Routes>
                </Row>
            </Container>
        </>
    );
};

export default App;
