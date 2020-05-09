import { theme } from "@chakra-ui/core";

const customTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        blueL: {
            bg: "#1597f1",
            primary: "#2FA6F2",
            secondary: "#0e48ab",
            hover: "#2B5DDA",
        },
        whiteL: "#FCFBFB",
        blackL: "#06070C",
        lightGrayL: {
            bg: "#F0EEF2",
            bg2: "#F4F7F8",
            bg3: "#F0EEF2",
            primary: "#FCF6F6",
            secondary: "#F5F5F5",
            hover: "#F9F6F9",
        },

        blueD: {
            bg: "#1597f1",
            primary: "#0c56d5",
            secondary: "#0e48ab",
        },
        blackD: "#06070C",
        grayD: {
            bg: "#202225",
            bg2: "#36393F",
            bg3: "#2F3136",
            primary: "#F9F6F9",
            secondary: "#7C9097",
            hover: "#393C43",
        },
    },
};

export default customTheme;
