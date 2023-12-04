import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { loginContext } from "../context/LoginContext";
import { useContext } from "react";
import { TwoFactorForm } from '../components/TwoFactorForm';
import { API_URL } from "../settings";

export default function TwoFactorPage() {
    const data = useContext(loginContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(data.mfa.mfaType !== "TOTP") return navigate("/login");
    }, []);

    return <TwoFactorForm submitURL={`${API_URL}/login`} onSuccess={async ({ response }) => {
        localStorage.setItem("accessToken", (await response.json()).accessToken);
        return navigate("/profile");
    }} userData={data} />
}