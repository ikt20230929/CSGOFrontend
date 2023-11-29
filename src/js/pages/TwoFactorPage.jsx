import React from 'react';
import { redirect } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useContext } from "react";
import { TwoFactorForm } from '../components/TwoFactorForm';
import { API_URL } from '../Globals';

export default function TwoFactorPage() {
    const data = useContext(LoginContext);
    console.log(LoginContext)

    if(data.mfa.mfaType !== "TOTP") redirect("/login");
    
    return <TwoFactorForm submitURL={`${API_URL}/login`} onSuccess={async ({ response }) => {
        localStorage.setItem("accessToken", (await response.json()).accessToken);
        return navigate("/profile");
    }} />
}