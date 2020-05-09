import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Editor from "rich-markdown-editor";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Box, Text, useColorMode, Spinner } from "@chakra-ui/core";

import ItemPopover from "../components/ItemPopover";

const GET_ITEM = gql`
    query getItem($categoryId: String!, $itemId: String!) {
        getItem(getItemInput: { categoryId: $categoryId, itemId: $itemId }) {
            id
            title
            body
        }
    }
`;

const EDIT_ITEM = gql`
    mutation editItem($categoryId: String!, $itemId: String!, $body: String!) {
        editItem(
            editItemInput: {
                categoryId: $categoryId
                itemId: $itemId
                body: $body
            }
        )
    }
`;

const Item = () => {
    const categId = localStorage.getItem("categoryId");
    const itmId = localStorage.getItem("itemId");

    const { data } = useQuery(GET_ITEM, {
        variables: {
            categoryId: categId,
            itemId: itmId,
        },
    });
    const [initData, setInitData] = useState("");

    const { colorMode } = useColorMode();
    const bgColor = { light: "#fff", dark: "#181A1B" };

    useEffect(() => {
        if (data) {
            setInitData(data.getItem.body);
        }
    }, [data]);

    const [editItem] = useMutation(EDIT_ITEM, {
        variables: {
            categoryId: categId,
            itemId: itmId,
            body: initData,
        },
        refetchQueries: ["getCategories"],
        onError(err) {
            if (err.graphQLErrors[0])
                console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
    });

    const handleChange = (value) => {
        setInitData(value);
        editItem();
    };

    let body;

    if (data && data.getItem) {
        body = (
            <>
                <Box
                    px={12}
                    py={4}
                    m={12}
                    key={data.getItem.id}
                    display="flex"
                    borderRadius="4px"
                    bg={bgColor[colorMode]}
                >
                    <Text as="h2" marginRight="auto" isTruncated>
                        {data.getItem.title}
                    </Text>
                    <Box marginLeft="auto">
                        <ItemPopover
                            categId={categId}
                            itmId={itmId}
                            initData={data.getItem}
                        />
                    </Box>
                </Box>

                <Box
                    p={12}
                    m={12}
                    borderRadius="4px"
                    height="auto"
                    bg={bgColor[colorMode]}
                >
                    <Editor
                        dark={colorMode === "dark" ? true : false}
                        key={data.getItem.id}
                        defaultValue={
                            data.getItem.body ? data.getItem.body : ""
                        }
                        onSave={(options) =>
                            console.log("Save triggered", options)
                        }
                        placeholder="Start here..."
                        onChange={handleChange}
                        autoFocus={true}
                    />
                </Box>
            </>
        );
    } else {
        body = (
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.400"
                color="gray.700"
                size="xl"
                position="absolute"
                top="50%"
                left="50%"
            />
        );
    }

    return body;
};

export default withRouter(Item);
