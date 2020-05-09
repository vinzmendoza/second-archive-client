import React, { useContext } from "react";
import { Box } from "@chakra-ui/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Header from "./Header";
import AuthContext from "../context/AuthContext";
import MainContent from "./MainContent";

const ME = gql`
    query me {
        me {
            id
            username
            joinedAt
            tokenVersion
        }
    }
`;

function Container({ children }) {
    const { data, loading } = useQuery(ME);
    const { authUser } = useContext(AuthContext);

    let body = null;

    if (loading) {
        body = null;
    } else if (authUser && data && data.me) {
        body = (
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                height="100vh"
            >
                <Header />
                <MainContent children={children} />
            </Box>
        );
    } else {
        body = children;
    }

    return body;
}

export default Container;
