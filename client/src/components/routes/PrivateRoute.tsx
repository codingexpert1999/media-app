import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { State } from "../../interfaces";

const PrivateRoute: React.FC<RouteProps> = props => {
    const {isAuthenticated} = useSelector((state: State) => state.user);

    return isAuthenticated === true ? (
        <Route {...props} />
    ) : (
        <Redirect to="/" />
    );
};

export default PrivateRoute;