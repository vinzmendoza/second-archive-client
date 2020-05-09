import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Flex, Image, Text, Link } from "@chakra-ui/core";

function NotFound() {
    return (
        <>
            <Flex justify="center" align="center">
                <Image
                    src={require("../images/pageNotFound.svg")}
                    size="400px"
                    alt="404 Page Not Found"
                />
            </Flex>
            <Flex justify="center" align="center" direction="column">
                <Text fontSize="6xl">Page Not Found</Text>
                <Link
                    as={RouterLink}
                    to="/"
                    textTransform="uppercase"
                    transition="0.1s"
                >
                    Click here to return
                </Link>
            </Flex>
        </>
    );
}

export default NotFound;
