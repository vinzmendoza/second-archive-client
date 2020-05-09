import React, { useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/core";
import Editor from "rich-markdown-editor";

const ME = gql`
    query me {
        me {
            id
            username
            joinedAt
            tokenVersion
        }
    }
`;

function Home() {
    const { data, loading, error } = useQuery(ME);

    const { colorMode } = useColorMode();
    const bgColor = { light: "white", dark: "#181A1B" };

    useEffect(() => {
        localStorage.removeItem("itemId");
    });

    const defaultVal = `# H1
## H2
### H3
* Unordered List Item 1
* Unordered List Item 2
1. Ordered List Item 1
2. Ordered List Item 2
> Quote Item 1
>> Quote Item 2
>>> Quote Item 3
`;

    if (loading) {
        return <h1>{loading}</h1>;
    }

    if (error) {
        return <h1>error...</h1>;
    }

    if (!data) {
        return <h1>no data...</h1>;
    }

    if (data) console.log(data);

    return (
        <Box m={6} borderRadius="3px">
            <Flex>
                <Box p={8} m={2} borderRadius="3px" bg={bgColor[colorMode]}>
                    <Text as="h3">
                        Welcome to Second Archive {data.me.username}!
                    </Text>
                    <Text as="p" textAlign="justify">
                        Second archive is a personal text data storage that uses
                        markdown to easily format the output text. You can start
                        by creating a Category and an Item under it.
                    </Text>
                </Box>
                <Box p={8} m={2} borderRadius="3px" bg={bgColor[colorMode]}>
                    <Text as="h3">What is a Markdown?</Text>
                    <Text as="p" textAlign="justify">
                        Markdown is a markup language with plain-text-formatting
                        syntax to easily change the output format of text. It
                        aims to make writing on the web easier and readable
                        through proper use of text formatting. Once you get used
                        to the shortcuts/commands of the markdowns, formatting
                        text will be way easier and more organized.
                    </Text>
                </Box>
            </Flex>
            <Flex>
                <Box
                    p={8}
                    m={2}
                    borderRadius="3px"
                    bg={bgColor[colorMode]}
                    width="400px"
                >
                    <Text as="h3">Markdown Example</Text>
                    <Text as="p"># H1</Text>
                    <Text as="p">## H2</Text>
                    <Text as="p">### H3</Text>
                    <Text as="p">* Unordered List Item 1</Text>
                    <Text as="p">* Unordered List Item 2</Text>
                    <Text as="p">1. Ordered List Item 1</Text>
                    <Text as="p">2. Ordered List Item 2</Text>
                    <Text as="p">> Quote Item 1</Text>
                    <Text as="p">>> Quote Item 2</Text>
                    <Text as="p">>>> Quote Item 3</Text>
                </Box>
                <Box
                    p={8}
                    m={2}
                    borderRadius="3px"
                    bg={bgColor[colorMode]}
                    width="400px"
                >
                    <Text as="h3" pb={2}>
                        Result
                    </Text>
                    <Editor
                        defaultValue={defaultVal}
                        readOnly={true}
                        dark={colorMode === "dark" ? true : false}
                    />
                </Box>
            </Flex>
        </Box>
    );
}

export default Home;
