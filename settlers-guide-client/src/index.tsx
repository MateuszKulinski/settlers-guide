import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import configureStore from "./store/configureStore";
import { _SERVER_URL_ } from "./assets/consts";
import Helmet from "react-helmet";
import "babel-polyfill";

const client = new ApolloClient({
    uri: `${_SERVER_URL_}/settlersGuideServer`,
    credentials: "include",
    cache: new InMemoryCache({
        resultCaching: false,
    }),
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={configureStore()}>
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <Helmet>
                        <link
                            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                            rel="stylesheet"
                        />
                    </Helmet>
                    <App />
                </ApolloProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
