import React, { useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    PseudoBox,
    Box,
    Button,
    useDisclosure,
    useColorMode,
} from "@chakra-ui/core";
import { FiMoreHorizontal } from "react-icons/fi";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import AlertDialogue from "./AlertDialogue.js";
import EditCategoryModal from "./EditCategoryModal";

const DELETE_CATEGORY = gql`
    mutation deleteCategory($categoryId: String!) {
        deleteCategory(categoryId: $categoryId)
    }
`;

const CategoryPopover = ({ value, history }) => {
    const [isAlertOpen, setIsAlertOpen] = useState();
    const onCloseAlert = () => setIsAlertOpen(false);
    const cancelRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };
    const hoverColor = { light: "blueL.hover", dark: "grayD.secondary" };

    const [removeCategory] = useMutation(DELETE_CATEGORY, {
        variables: { categoryId: value.id },
        refetchQueries: ["getCategories"],
        update() {
            history.push("/");
        },
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    return (
        <Popover usePortal>
            <AlertDialogue
                isAlertOpen={isAlertOpen}
                cancelRef={cancelRef}
                removeCategory={removeCategory}
                onCloseAlert={onCloseAlert}
            />
            <EditCategoryModal
                isOpen={isOpen}
                onClose={onClose}
                categoryId={value.id}
                categoryTitle={value.category}
            />
            <PopoverTrigger>
                <PseudoBox
                    as="button"
                    _hover={{ color: hoverColor[colorMode] }}
                    _focus={{
                        boxShadow: "none",
                    }}
                    p={2}
                    m={1}
                    borderRadius="none"
                    transition="0.1s"
                >
                    <Box as={FiMoreHorizontal} size="18px" />
                </PseudoBox>
            </PopoverTrigger>
            <PopoverContent
                zIndex={4}
                width="250px"
                marginLeft={32}
                bg={bgColor[colorMode]}
            >
                <PopoverArrow />
                <PopoverHeader
                    fontSize={24}
                    overflow="hidden"
                    whiteSpace="nowrap"
                    isTruncated
                >
                    {value.category}
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                    <Button
                        variantColor="green"
                        width="100%"
                        mb={2}
                        onClick={onOpen}
                    >
                        Edit Category
                    </Button>
                    <Button
                        variantColor="red"
                        width="100%"
                        mb={2}
                        onClick={() => setIsAlertOpen(true)}
                    >
                        Delete Category
                    </Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default withRouter(CategoryPopover);
