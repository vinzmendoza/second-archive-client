import React, { useContext, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import {
    Avatar,
    Flex,
    FormLabel,
    Switch,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    Stack,
    Text,
    Box,
    useColorMode,
} from "@chakra-ui/core";
import { FiMoon } from "react-icons/fi";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { setAccessToken } from "../utils/accessTokenItem";
import AuthContext from "../context/AuthContext";

const LOGOUT = gql`
    mutation logout {
        logout
    }
`;

const MenuPopover = ({ user }) => {
    const [logout, { client }] = useMutation(LOGOUT);
    let history = useHistory();

    const { setAuthUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
            setAuthUser(null);
            setAccessToken("");

            if (client) await client.resetStore();
        } catch (err) {
            history.push("/login");
        }
    };

    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    const [isDark, setIsDark] = useState(colorMode === "dark" ? true : false);

    const handleSwitchMode = () => {
        toggleColorMode();
        setIsDark(!isDark);
    };

    return (
        <Popover usePortal>
            <PopoverTrigger>
                <Button
                    marginLeft="auto"
                    width="0"
                    borderRadius="50%"
                    backgroundColor="green.500"
                >
                    <Avatar name={user} size="md" />
                </Button>
            </PopoverTrigger>
            <PopoverContent zIndex={4} width="190px" bg={bgColor[colorMode]}>
                <PopoverArrow marginLeft={8} />
                <PopoverHeader
                    fontSize={24}
                    overflow="hidden"
                    whiteSpace="nowrap"
                    isTruncated
                >
                    {user}
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                    <Stack>
                        <Box>
                            <FormLabel htmlFor="email-alerts">
                                <Flex>
                                    <Box
                                        as={FiMoon}
                                        size="18px"
                                        justifyContent="center"
                                        alignSelf="center"
                                        mr={2}
                                    />
                                    <Text>Dark Theme</Text>
                                </Flex>
                            </FormLabel>
                            <Switch
                                size="md"
                                onChange={handleSwitchMode}
                                isChecked={isDark}
                            />
                        </Box>
                        <Button width="100%" mb={2} onClick={handleLogout}>
                            Logout
                        </Button>
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default withRouter(MenuPopover);
