import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { setAccessToken, getAccessToken } from "../utils/accessTokenItem";
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
    useToast,
} from "@chakra-ui/core";
import { FiUser, FiLock } from "react-icons/fi";

import { registerValidator } from "../utils/inputValidator";
import useForm from "../hooks/useForm";

const REGISTER_MUTATION = gql`
    mutation register(
        $username: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            username
            joinedAt
            tokenVersion
        }
    }
`;

function Register({ history }) {
    const { onChange, onSubmit, values, errors } = useForm(
        registerCallback,
        registerValidator
    );

    const toast = useToast();

    const [registerServerError, setRegisterServerError] = useState({});

    const [register, { loading }] = useMutation(REGISTER_MUTATION, {
        update(_, result) {
            if (result && result.data) {
                setAccessToken(result.data.register.accessToken);
            }

            toast({
                title: "Account created.",
                description:
                    "You will be redirected to the login page in a few seconds...",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            values.username = "";
            values.password = "";
            values.confirmPassword = "";

            setTimeout(() => {
                history.push("/login");
            }, 2000);
        },
        onError(err) {
            if (err.graphQLErrors[0])
                setRegisterServerError(
                    err.graphQLErrors[0].extensions.exception.errors
                );
        },
        variables: values,
    });

    function registerCallback() {
        register();
    }

    const isAuth = getAccessToken();

    if (isAuth) {
        history.push("/");
    }

    const { colorMode } = useColorMode();
    const bgColor = { light: "whiteL", dark: "grayD.bg3" };
    const textHoverColor = { light: "blueL.hover", dark: "grayD.primary" };
    const textColor = { light: "whiteL", dark: "grayD.bg" };

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
                    Register
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
                                        (registerServerError &&
                                            registerServerError.username)
                                            ? true
                                            : false
                                    }
                                    errorBorderColor="red.300"
                                />
                            </InputGroup>
                            {(errors && errors.username) ||
                            (registerServerError &&
                                registerServerError.username) ? (
                                <Text textAlign="center" color="red.300">
                                    {errors && errors.username
                                        ? errors.username
                                        : registerServerError &&
                                          registerServerError.username
                                        ? registerServerError.username
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
                                        (registerServerError &&
                                            registerServerError.password)
                                            ? true
                                            : false
                                    }
                                    errorBorderColor="red.300"
                                />
                            </InputGroup>
                            {(errors && errors.password) ||
                            (registerServerError &&
                                registerServerError.password) ? (
                                <Text textAlign="center" color="red.300">
                                    {errors && errors.password
                                        ? errors.password
                                        : registerServerError &&
                                          registerServerError.password
                                        ? registerServerError.password
                                        : null}
                                </Text>
                            ) : null}
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="confirmPassword">
                                Confirm Password
                            </FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    children={<Box as={FiLock} size="18px" />}
                                />
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={values.confirmPassword || ""}
                                    autoComplete="off"
                                    onChange={onChange}
                                    isInvalid={
                                        (errors && errors.confirmPassword) ||
                                        (registerServerError &&
                                            registerServerError.confirmPassword)
                                            ? true
                                            : false
                                    }
                                    errorBorderColor="red.300"
                                />
                            </InputGroup>
                            {(errors && errors.confirmPassword) ||
                            (registerServerError &&
                                registerServerError.confirmPassword) ? (
                                <Text textAlign="center" color="red.300">
                                    {errors && errors.confirmPassword
                                        ? errors.confirmPassword
                                        : registerServerError &&
                                          registerServerError.confirmPassword
                                        ? registerServerError.confirmPassword
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
                            Sign up
                        </Button>
                        <FormHelperText textAlign="center">
                            <Link
                                as={RouterLink}
                                to="/login"
                                _hover={{ color: textHoverColor[colorMode] }}
                            >
                                Back to login.
                            </Link>
                        </FormHelperText>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
}
export default Register;
