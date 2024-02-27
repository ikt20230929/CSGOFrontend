import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { loginContext } from "../context/LoginContext";
import { useContext } from "react";
import { TwoFactorForm } from '../components/TwoFactorForm';
import { API_URL } from "../settings";
import { useDispatch } from 'react-redux';
import { actions } from '../store';
import { fetchProfile } from '../Globals';

export default function TwoFactorPage() {
    const data = useContext(loginContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(data.mfa.mfaType !== "TOTP") return navigate("/login");
    }, []);

    return <TwoFactorForm submitURL={`${API_URL}/login`} onSuccess={async ({ response }) => {
        var token = (await response.json()).message;
        dispatch(actions.setAccessToken(token));
        if(await fetchProfile()) {
            return navigate("/profile");
        }else{
            // how did we get here?
            return navigate("/login");
        }
    }} userData={data} />
}