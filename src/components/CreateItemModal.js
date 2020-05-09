import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
    Button,
    Box,
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
    Stack,
    useColorMode,
} from "@chakra-ui/core";
import { FiFilePlus } from "react-icons/fi";

const CREATE_ITEM = gql`
    mutation createItem($categoryId: String!, $title: String!) {
        createItem(itemInput: { categoryId: $categoryId, title: $title }) {
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

const CreateItemModal = ({ isOpen, onClose, categoryId, finalFocusRef }) => {
    const [title, setTitle] = useState("");

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    const [createNewItem] = useMutation(CREATE_ITEM, {
        variables: {
            categoryId,
            title,
        },
        refetchQueries: ["getCategories"],
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    const handleCreateNewItem = () => {
        createNewItem();
        onClose();
        setTitle("");
    };

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            finalFocusRef={finalFocusRef}
        >
            <ModalOverlay />
            <ModalContent bg={bgColor[colorMode]}>
                <ModalHeader>Create item</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftElement
                            children={<Box as={FiFilePlus} color="gray.500" />}
                        />
                        <Input
                            type="text"
                            name="title"
                            value={title || ""}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Stack isInline spacing={4}>
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            onClick={handleCreateNewItem}
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

export default CreateItemModal;
