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
import { FiEdit } from "react-icons/fi";

const EDIT_CATEGORY = gql`
    mutation editCategory($categoryId: String!, $category: String!) {
        editCategory(
            editCategoryInput: { categoryId: $categoryId, category: $category }
        )
    }
`;

function EditCategoryModal({ categoryId, isOpen, onClose, categoryTitle }) {
    const [category, setCategory] = useState("");

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    const [editCategoryMutation] = useMutation(EDIT_CATEGORY, {
        variables: { categoryId, category },
        refetchQueries: ["getCategories"],
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    const handleEditMutation = () => {
        editCategoryMutation();
        onClose();
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor[colorMode]}>
                <ModalHeader>Edit category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftElement
                            children={<Box as={FiEdit} color="gray.500" />}
                        />
                        <Input
                            type="text"
                            name="category"
                            placeholder={categoryTitle}
                            value={category || ""}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Stack isInline spacing={4}>
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            onClick={handleEditMutation}
                            variantColor="green"
                        >
                            Confirm Edit
                        </Button>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditCategoryModal;
