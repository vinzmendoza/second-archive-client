import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Stack,
    useColorMode,
} from "@chakra-ui/core";
import { FiFolderPlus } from "react-icons/fi";

const CREATE_CATEGORY = gql`
    mutation createCategory($category: String!) {
        createCategory(category: $category) {
            id
            category
            createdBy {
                id
                username
            }
            items {
                id
                title
                body
            }
        }
    }
`;

const GET_CATEGORIES = gql`
    query getCategories {
        getCategories {
            id
            category
            createdBy {
                id
                username
            }
            items {
                id
                title
                body
            }
        }
    }
`;

const CreateCategoryModal = ({ isOpen, onClose, finalFocusRef }) => {
    const [category, setCategory] = useState("");

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    const [createNewCategory] = useMutation(CREATE_CATEGORY, {
        variables: {
            category,
        },
        update(proxy, { data }) {
            let initValue;
            try {
                initValue = proxy.readQuery({
                    query: GET_CATEGORIES,
                });

                if (initValue) {
                    initValue.getCategories = [
                        ...initValue.getCategories,
                        data.createCategory,
                    ];
                }

                proxy.writeQuery({
                    query: GET_CATEGORIES,
                    data: initValue,
                });
            } catch (err) {
                console.log(err);
            }

            setCategory("");
            onClose();
        },
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            finalFocusRef={finalFocusRef}
        >
            <ModalOverlay />
            <ModalContent bg={bgColor[colorMode]}>
                <ModalHeader>Create category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftElement
                            children={
                                <Box as={FiFolderPlus} color="gray.500" />
                            }
                        />
                        <Input
                            type="text"
                            name="category"
                            value={category || ""}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Stack isInline spacing={4}>
                        <Button onClick={onClose}>Close</Button>

                        <Button
                            onClick={createNewCategory}
                            variantColor="green"
                        >
                            Add
                        </Button>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateCategoryModal;
