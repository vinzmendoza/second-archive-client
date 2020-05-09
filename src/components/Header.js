import React, { useContext } from "react";
import { Box, Text, useColorMode, Link } from "@chakra-ui/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link as LinkRouter } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import MenuPopover from "./MenuPopover";

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

export default function Header() {
    const { data, loading } = useQuery(ME);

    const { authUser } = useContext(AuthContext);

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg2" };
    const textColor = { light: "blackL", dark: "whiteL" };
    const hoverColor = { light: "blueL.hover", dark: "grayD.secondary" };

    React.useEffect(() => {
        localStorage.removeItem("itemId");
    }, []);

    let body = null;

    if (authUser && data && data.me) {
        body = (
            <Box
                bg={bgColor[colorMode]}
                display="flex"
                w="100%"
                boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                zIndex={3}
                px={4}
            >
                <Box width="64" p={2} display="flex" alignItems="center">
                    <Link
                        as={LinkRouter}
                        to="/"
                        color={textColor[colorMode]}
                        _hover={{ color: hoverColor[colorMode] }}
                    >
                        <Text as="h2" textTransform="uppercase" fontSize={18}>
                            Second Archive
                        </Text>
                    </Link>
                </Box>
                <Box display="flex" px={6} py={4} flex="1">
                    <MenuPopover user={data.me.username} />
                </Box>
            </Box>
        );
    } else if (loading) {
        body = (
            <Box
                bg={bgColor[colorMode]}
                display="flex"
                w="100%"
                boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                zIndex={2}
            ></Box>
        );
    }

    return body;
}
