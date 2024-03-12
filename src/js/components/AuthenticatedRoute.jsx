import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const AuthenticatedRoute = ({ children, checkAdmin }) => {
    const authenticated = useSelector(state => state.auth).accessToken != null;
    const { profile } = useSelector(state => state.data);

    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    if (checkAdmin) {
        if (!profile.userIsAdmin) {
            return <Navigate to="/home" />;
        }
    }

    return children;
};