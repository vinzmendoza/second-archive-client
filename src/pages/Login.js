import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { setAccessToken } from "../utils/accessTokenItem";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Divider,
    InputGroup,
    InputLeftElement,
    FormHelperText,
    Text,
    useColorMode,
    Link,
} from "@chakra-ui/core";
import { FiUser, FiLock } from "react-icons/fi";

import { loginValidator } from "../utils/inputValidator";
import useForm from "../hooks/useForm";
import { getAccessToken } from "../utils/accessTokenItem";
import AuthContext from "../context/AuthContext";

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(loginInput: { username: $username, password: $password }) {
            id
            username
            joinedAt
            accessToken
            tokenVersion
        }
    }
`;

const ME = gql`
    query me {
        me {
            id
            username
            joinedAt
            accessToken
            tokenVersion
        }
    }
`;

function Login({ history }) {
    const { onChange, onSubmit, values, errors } = useForm(
        loginCallback,
        loginValidator
    );

    const { setAuthUser } = useContext(AuthContext);

    const [loginServerError, setLoginServerError] = useState({});

    const { colorMode } = useColorMode();
    const bgColor = { light: "whiteL", dark: "grayD.bg3" };
    const textHoverColor = { light: "blueL.hover", dark: "grayD.primary" };
    const textColor = { light: "whiteL", dark: "grayD.bg" };

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        update(store, { data }) {
            if (!data) {
                return null;
            }

            store.writeQuery({
                query: ME,
                data: {
                    me: data.login,
                },
            });

            if (data) {
                setAuthUser(data.login.accessToken);
                setAccessToken(data.login.accessToken);
            }

            history.push("/");
        },
        onError(err) {
            if (err.graphQLErrors[0])
                setLoginServerError(
                    err.graphQLErrors[0].extensions.exception.errors
                );
        },
        variables: values,
    });

    function loginCallback() {
        login();
    }

    const isAuth = getAccessToken();

    if (isAuth) {
        history.push("/");
    }

    return (
        <Flex p={24} alignItems="center" justify="center">
            <Box
                p={6}
                m="auto"
                boxShadow="lg"
                rounded="lg"
                bg={bgColor[colorMode]}
            >
                <Heading
                    textAlign="center"
                    as="h3"
                    size="lg"
                    textTransform="uppercase"
                >
                    Login
                </Heading>
                <Divider />
                <form onSubmit={onSubmit}>
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    children={<Box as={FiUser} size="18px" />}
                                />
                                <Input
                                    type="text"
                                    name="username"
                                    value={values.username || ""}
                                    onChange={onChange}
                                    isInvalid={
                                        (errors && errors.username) ||
                                        (loginServerError &&
                                            loginServerError.username)
                                            ? true
                                            : false
                                    }
                                    errorBorderColor="red.300"
                                />
                            </InputGroup>
                            {(errors && errors.username) ||
                            (loginServerError && loginServerError.username) ? (
                                <Text textAlign="center" color="red.300">
                                    {errors && errors.username
                                        ? errors.username
                                        : loginServerError &&
                                          loginServerError.username
                                        ? loginServerError.username
                                        : null}
                                </Text>
                            ) : null}
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    children={<Box as={FiLock} size="18px" />}
                                />
                                <Input
                                    type="password"
                                    name="password"
                                    value={values.password || ""}
                                    autoComplete="off"
                                    onChange={onChange}
                                    isInvalid={
                                        (errors && errors.password) ||
                                        (loginServerError &&
                                            loginServerError.password)
                                            ? true
                                            : false
                                    }
                                    errorBorderColor="red.300"
                                />
                            </InputGroup>
                            {(errors && errors.password) ||
                            (loginServerError && loginServerError.password) ? (
                                <Text textAlign="center" color="red.300">
                                    {errors && errors.password
                                        ? errors.password
                                        : loginServerError &&
                                          loginServerError.password
                                        ? loginServerError.password
                                        : null}
                                </Text>
                            ) : null}
                        </FormControl>
                        <Button
                            type="submit"
                            isLoading={loading}
                            _hover={{
                                bg: textHoverColor[colorMode],
                                color: textColor[colorMode],
                            }}
                        >
                            Sign in
                        </Button>
                        <FormHelperText textAlign="center">
                            <Link
                                as={RouterLink}
                                to="/register"
                                _hover={{ color: textHoverColor[colorMode] }}
                            >
                                Haven't signed up yet? Click here.
                            </Link>
                        </FormHelperText>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
}

export default Login;
