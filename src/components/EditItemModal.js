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
import { FiEdit } from "react-icons/fi";

const EDIT_ITEM_TITLE = gql`
    mutation editItemTitle(
        $categoryId: String!
        $itemId: String!
        $title: String!
    ) {
        editItemTitle(
            editItemTitleInput: {
                categoryId: $categoryId
                itemId: $itemId
                title: $title
            }
        )
    }
`;

function EditItemModal({ categId, itmId, isOpen, onClose, itemTitle }) {
    const [item, setItem] = useState("");

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    const [editItemTitle] = useMutation(EDIT_ITEM_TITLE, {
        variables: {
            categoryId: categId,
            itemId: itmId,
            title: item,
        },
        refetchQueries: ["getCategories"],
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    const handleEditItemTitle = () => {
        editItemTitle();
        onClose();
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent bg={bgColor[colorMode]}>
                <ModalHeader>Edit item</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftElement
                            children={<Box as={FiEdit} color="gray.500" />}
                        />
                        <Input
                            type="text"
                            name="item"
                            placeholder={itemTitle}
                            value={item || ""}
                            onChange={(e) => setItem(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <Stack isInline spacing={4}>
                        <Button onClick={onClose}>Close</Button>
                        <Button
                            onClick={handleEditItemTitle}
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

export default EditItemModal;
