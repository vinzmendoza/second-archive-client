import React from "react";
import { Route, Redirect } from "react-router-dom";

import { getAccessToken } from "../utils/accessTokenItem";

function PrivateRoute({ component: Component, ...rest }) {
    const isAuth = getAccessToken();

    return (
        <Route
            {...rest}
            render={props =>
                isAuth !== "" ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default PrivateRoute;
