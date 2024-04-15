import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { actions } from "../store";
import { useDispatch } from 'react-redux';

export default function LogoutPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.setAccessToken(null));
        dispatch(actions.setProfile([]));
        dispatch(actions.setInventory([]));
        dispatch(actions.setCases([]));
    }, []);

    return <Navigate to="/login" />
}