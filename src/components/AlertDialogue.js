import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Stack,
    useColorMode,
} from "@chakra-ui/core";

const AlertDialogue = ({
    isAlertOpen,
    onCloseAlert,
    removeCategory,
    cancelRef,
}) => {
    const handleOnDelete = () => {
        removeCategory();
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
                    Delete Category
                </AlertDialogHeader>

                <AlertDialogBody>
                    Items under this category will be deleted. You can't undo
                    this action afterwards. Are you sure?
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Stack isInline spacing={2}>
                        <Button ref={cancelRef} onClick={onCloseAlert}>
                            Cancel
                        </Button>
                        <Button
                            variantColor="red"
                            onClick={handleOnDelete}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </Stack>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogue;
