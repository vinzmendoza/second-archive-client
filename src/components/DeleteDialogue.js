import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useColorMode,
} from "@chakra-ui/core";

const DeleteDialogue = ({
    isAlertOpen,
    onCloseAlert,
    removeItem,
    cancelRef,
}) => {
    const handleOnDelete = () => {
        removeItem();
        onCloseAlert();
    };

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.primary", dark: "grayD.bg" };

    return (
        <AlertDialog
            isOpen={isAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCloseAlert}
        >
            <AlertDialogOverlay />
            <AlertDialogContent bg={bgColor[colorMode]}>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Item
                </AlertDialogHeader>

                <AlertDialogBody>
                    Are you sure you want to delete this item? You can't
                    retrieve the item after deletion.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onCloseAlert}>
                        Cancel
                    </Button>
                    <Button variantColor="red" onClick={handleOnDelete} ml={3}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialogue;
