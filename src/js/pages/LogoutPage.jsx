import React from 'react';
import { Navigate } from "react-router-dom";
import { actions } from "../store";
import { useDispatch } from 'react-redux';

export default function LogoutPage() {
    const dispatch = useDispatch();

    dispatch(actions.setAccessToken(null));
    dispatch(actions.setProfile(null));
    dispatch(actions.setInventory(null));
    dispatch(actions.setCases(null));

    return <Navigate to="/login" />
}