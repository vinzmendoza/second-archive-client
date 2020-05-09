import React from "react";
import { Box, useColorMode } from "@chakra-ui/core";

import Sidebar from "./Sidebar";

const MainContent = ({ children }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.bg", dark: "grayD.bg" };

    return (
        <Box display="flex" flex="1" overflowY="hidden">
            <Sidebar />

            <Box flex="1" overflowY="auto" bg={bgColor[colorMode]}>
                {children}
            </Box>
        </Box>
    );
};

export default MainContent;
