import React, { useState, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    Box,
    List,
    ListItem,
    ListIcon,
    Tooltip,
    PseudoBox,
    useDisclosure,
    Text,
    useColorMode,
} from "@chakra-ui/core";
import { FiHash, FiPlus, FiChevronRight, FiChevronDown } from "react-icons/fi";

import CreateItemModal from "./CreateItemModal";
import CreateCategoryModal from "./CreateCategoryModal";
import CategoryPopover from "./CategoryPopover";

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

const Sidebar = ({ history }) => {
    const { data, loading } = useQuery(GET_CATEGORIES);

    const [categoryId, setCategoryId] = useState("");

    const [isCategory, setIsCategory] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const finalRef = useRef();

    const handleOpenModal = (id) => {
        setCategoryId(id);
        setIsCategory(false);
        onOpen();
    };

    const handleOpenCategory = () => {
        setIsCategory(true);
        onOpen();
    };

    const handleSetCurrentItem = (categoryId, itemId) => {
        localStorage.setItem("categoryId", categoryId);
        localStorage.setItem("itemId", itemId);
    };

    const itemIdUrl = history.location.pathname.split("/")[2];

    const { colorMode } = useColorMode();
    const bgColor = { light: "lightGrayL.secondary", dark: "grayD.bg3" };
    const textColor = { light: "gray.700", dark: "grayD.secondary" };
    const textActiveColor = { light: "gray.700", dark: "grayD.primary" };
    const hoverColor = { light: "gray.200", dark: "grayD.hover" };
    const btnColor = { light: "blueL.bg", dark: "grayD.bg" };
    const btnTextColor = { light: "whiteL", dark: "grayD.primary" };
    const hoverBtnColor = { light: "blueL.hover", dark: "grayD.hover" };
    const hoverPlusColor = { light: "blueL.hover", dark: "grayD.secondary" };

    let body = null;

    if (loading) {
        body = (
            <Box
                bg={bgColor[colorMode]}
                width="64"
                flex="none"
                overflowY="auto"
                display="flex"
                flexDirection="column"
                justifyContent="justify-between"
            ></Box>
        );
    } else if (data && data.getCategories) {
        body = (
            <Box
                bg={bgColor[colorMode]}
                width="64"
                flex="none"
                overflowY="auto"
                display="flex"
                flexDirection="column"
                justifyContent="justify-between"
                boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                zIndex={2}
            >
                <Box overflowY="auto" flex="1" px={2} py={6} ref={finalRef}>
                    {isCategory ? (
                        <CreateCategoryModal
                            finalFocusRef={finalRef}
                            isOpen={isOpen}
                            onClose={onClose}
                        />
                    ) : (
                        <CreateItemModal
                            finalFocusRef={finalRef}
                            isOpen={isOpen}
                            onClose={onClose}
                            categoryId={categoryId}
                        />
                    )}
                    <Accordion
                        defaultIndex={[
                            ...Array(data.getCategories.length).keys(),
                        ]}
                        allowMultiple
                    >
                        {data.getCategories.map((value, index) => (
                            <AccordionItem py={1} key={value.id} border="none">
                                {({ isExpanded }) => (
                                    <>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <AccordionHeader marginRight={1}>
                                                <Box
                                                    as={
                                                        isExpanded
                                                            ? FiChevronDown
                                                            : FiChevronRight
                                                    }
                                                    size="16px"
                                                />
                                                <Box
                                                    flex="1"
                                                    textAlign="left"
                                                    paddingLeft={1}
                                                    overflow="hidden"
                                                    whiteSpace="nowrap"
                                                    maxWidth="100px"
                                                >
                                                    <Text
                                                        isTruncated
                                                        fontWeight="semibold"
                                                        fontSize="16px"
                                                        textTransform="uppercase"
                                                    >
                                                        {value.category}
                                                    </Text>
                                                </Box>
                                            </AccordionHeader>
                                            <CategoryPopover value={value} />
                                            <Tooltip
                                                hasArrow
                                                label="Add item"
                                                placement="bottom"
                                                zIndex={3}
                                            >
                                                <PseudoBox
                                                    as="button"
                                                    _hover={{
                                                        color:
                                                            hoverPlusColor[
                                                                colorMode
                                                            ],
                                                    }}
                                                    _focus={{
                                                        boxShadow: "none",
                                                    }}
                                                    p={2}
                                                    m={1}
                                                    borderRadius="none"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            value.id
                                                        )
                                                    }
                                                    transition="0.1s"
                                                >
                                                    <Box
                                                        as={FiPlus}
                                                        size="18px"
                                                    />
                                                </PseudoBox>
                                            </Tooltip>
                                        </Box>

                                        <AccordionPanel pb={4}>
                                            <List>
                                                {value.items.map((item) => (
                                                    <ListItem
                                                        fontSize="16px"
                                                        mb={1}
                                                        as={Link}
                                                        to={`/${value.category}/${item.id}`}
                                                        key={item.id}
                                                        onClick={() =>
                                                            handleSetCurrentItem(
                                                                value.id,
                                                                item.id,
                                                                item.title
                                                            )
                                                        }
                                                        overflow="hidden"
                                                        whiteSpace="nowrap"
                                                        maxWidth="210px"
                                                        transition="0.1s"
                                                        display="block"
                                                        p={2}
                                                        isTruncated
                                                        bg={
                                                            itemIdUrl ===
                                                            item.id
                                                                ? hoverColor[
                                                                      colorMode
                                                                  ]
                                                                : ""
                                                        }
                                                        color={
                                                            itemIdUrl ===
                                                            item.id
                                                                ? textActiveColor[
                                                                      colorMode
                                                                  ]
                                                                : textColor[
                                                                      colorMode
                                                                  ]
                                                        }
                                                        _hover={{
                                                            bg:
                                                                hoverColor[
                                                                    colorMode
                                                                ],
                                                        }}
                                                    >
                                                        <ListIcon
                                                            icon={FiHash}
                                                            size="14px"
                                                        />

                                                        {item.title}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Box>
                <Box mx={2} my={4} p={2}>
                    <PseudoBox
                        display="flex"
                        as="button"
                        color={btnTextColor[colorMode]}
                        _hover={{
                            bg: hoverBtnColor[colorMode],
                            color: btnTextColor[colorMode],
                        }}
                        _focus={{
                            boxShadow: "none",
                        }}
                        bg={btnColor[colorMode]}
                        py={2}
                        px={4}
                        borderRadius="3px"
                        onClick={handleOpenCategory}
                        transition="0.1s"
                    >
                        <Box
                            _hover={{ color: "white" }}
                            as={FiPlus}
                            size="24px"
                            justifyContent="center"
                            alignSelf="center"
                            pr="6px"
                        />
                        Add New Category
                    </PseudoBox>
                </Box>
            </Box>
        );
    } else {
        body = null;
    }

    return body;
};

export default withRouter(Sidebar);
