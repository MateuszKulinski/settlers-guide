import { Header } from "./components/layout/partials/header/Header";
import Main from "./components/Main/Main";
import Error from "./components/Error/Error";
import React, { useEffect } from "react";
import "./App.css";
import useRefreshMe from "./hooks/useRefreshMe";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import { AdventureCategorySetType } from "./store/categories/Reducer";
import AddGuide from "./components/Guides/AddGuide/AddGuide";
import { Route, Routes } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import {
    _URL_EDIT_GENERAL_,
    _URL_EDIT_GUIDE_,
    _URL_GENERALS_,
    _URL_GUIDES_,
    _URL_HOME_,
    _URL_NEW_GENERAL_,
    _URL_NEW_GUIDE_,
} from "./assets/consts";
import EditGeneral from "./components/Generals/EditGeneral/EditGeneral";
import GeneralsList from "./components/Generals/GeneralsList";
import GuideList from "./components/Guides/GuideList";
import EditGuide from "./components/Guides/EditGuide/EditGuide";

const GetAllAdventureCategories = gql`
    query {
        getAdventureCategories {
            ... on EntityResult {
                messages
            }
            ... on AdventureCategoryArray {
                categories {
                    id
                    name
                    adventures {
                        name
                        id
                    }
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
        if (
            categoriesData &&
            categoriesData.getAdventureCategories.categories
        ) {
            dispatch({
                type: AdventureCategorySetType,
                payload: categoriesData.getAdventureCategories.categories,
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
                            path={`${_URL_EDIT_GUIDE_}:guideId`}
                            element={<EditGuide />}
                        />
                        <Route path={_URL_GUIDES_} element={<GuideList />} />
                        <Route
                            path={_URL_NEW_GENERAL_}
                            element={<EditGeneral />}
                        />
                        <Route
                            path={_URL_GENERALS_}
                            element={<GeneralsList />}
                        />
                        <Route
                            path={`${_URL_EDIT_GENERAL_}:generalId`}
                            element={<EditGeneral />}
                        />
                        <Route path={_URL_NEW_GUIDE_} element={<Error />} />
                    </Routes>
                </Row>
            </Container>
        </>
    );
};

export default App;
