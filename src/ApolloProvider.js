import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { ApolloProvider } from "@apollo/react-hooks";
import { getAccessToken, setAccessToken } from "./utils/accessTokenItem";
import { setContext } from "apollo-link-context";
import jwtDecode from "jwt-decode";
import { onError } from "apollo-link-error";

let accessToken = "";
const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include"
});

const authLink = setContext(async (_, { headers }) => {
    accessToken = await getAccessToken();

    return {
        headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : ""
        }
    };
});

const refreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
            return true;
        }

        try {
            const { exp } = jwtDecode(token);

            if (Date.now() >= exp * 1000) {
                return false;
            } else {
                return true;
            }
        } catch {
            return false;
        }
    },
    fetchAccessToken: () => {
        return fetch("http://localhost:5000/refresh_token", {
            method: "POST",
            credentials: "include"
        });
    },
    handleFetch: accessTokenField => {
        setAccessToken(accessTokenField);
    },
    handleError: err => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
        console.log(err);
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([
        refreshLink,
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) console.log(graphQLErrors);
            if (networkError) console.log(networkError);
        }),
        authLink,
        httpLink
    ]),
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
