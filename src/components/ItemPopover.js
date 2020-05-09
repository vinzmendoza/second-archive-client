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

import EditItemModal from "./EditItemModal";
import DeleteDialogue from "./DeleteDialogue";

const DELETE_ITEM = gql`
    mutation deleteItem($categoryId: String!, $itemId: String!) {
        deleteItem(categoryId: $categoryId, itemId: $itemId)
    }
`;

const ItemPopover = ({ categId, itmId, history, initData }) => {
    const [isAlertOpen, setIsAlertOpen] = useState();
    const onCloseAlert = () => setIsAlertOpen(false);
    const cancelRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };
    const hoverColor = { light: "blueL.hover", dark: "grayD.secondary" };

    const [removeItem] = useMutation(DELETE_ITEM, {
        variables: {
            categoryId: categId,
            itemId: itmId,
        },
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
            <DeleteDialogue
                isAlertOpen={isAlertOpen}
                cancelRef={cancelRef}
                removeItem={removeItem}
                onCloseAlert={onCloseAlert}
            />
            <EditItemModal
                isOpen={isOpen}
                onClose={onClose}
                categId={categId}
                itmId={itmId}
                itemTitle={initData.title}
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
                >
                    <Box as={FiMoreHorizontal} size="18px" />
                </PseudoBox>
            </PopoverTrigger>
            <PopoverContent
                zIndex={4}
                width="250px"
                marginRight={16}
                bgColor={bgColor[colorMode]}
            >
                <PopoverArrow marginLeft={8} />
                <PopoverHeader
                    fontSize={24}
                    overflow="hidden"
                    whiteSpace="nowrap"
                    isTruncated
                >
                    {initData.title}
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                    <Button
                        variantColor="green"
                        width="100%"
                        mb={2}
                        onClick={onOpen}
                    >
                        Edit Item
                    </Button>
                    <Button
                        variantColor="red"
                        width="100%"
                        mb={2}
                        onClick={() => setIsAlertOpen(true)}
                    >
                        Delete Item
                    </Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default withRouter(ItemPopover);
