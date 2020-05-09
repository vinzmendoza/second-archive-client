import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
    ColorModeProvider,
    CSSReset,
    ThemeProvider,
    Spinner,
} from "@chakra-ui/core";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Item from "./pages/Item";
import Container from "./components/Container";
import { setAccessToken } from "./utils/accessTokenItem";
import PrivateRoute from "./utils/PrivateRoute";
import AuthContext from "./context/AuthContext";
import customTheme from "./chakra-ui/customTheme";

function App() {
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState({});

    useEffect(() => {
        fetch("https://second-archive-server.herokuapp.com/refresh_token", {
            method: "POST",
            credentials: "include",
        }).then(async (x) => {
            const { accessToken } = await x.json();
            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);

    //indicate if app is loading
    if (loading) {
        return (
            <ThemeProvider>
                <CSSReset />
                <Spinner size="xl" position="absolute" top="50%" left="50%" />
            </ThemeProvider>
        );
    }

    return (
        <Router>
            <AuthContext.Provider value={{ authUser, setAuthUser }}>
                <ThemeProvider theme={customTheme}>
                    <ColorModeProvider>
                        <CSSReset />

                        <Container>
                            <Switch>
                                <PrivateRoute exact path="/" component={Home} />
                                <PrivateRoute
                                    exact
                                    path="/:category/:id"
                                    component={Item}
                                />
                                <Route exact path="/login" component={Login} />
                                <Route
                                    exact
                                    path="/register"
                                    component={Register}
                                />
                                <Route path="*" component={NotFound} />
                            </Switch>
                        </Container>
                    </ColorModeProvider>
                </ThemeProvider>
            </AuthContext.Provider>
        </Router>
    );
}

export default App;
