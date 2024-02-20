import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const AuthenticatedRoute = ({ children }) => {
    const authenticated = useSelector(state => state.auth).accessToken != null;
    if (!authenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};