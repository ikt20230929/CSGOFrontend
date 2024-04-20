import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { loginContext } from "../context/LoginContext";
import { useContext } from "react";
import { TwoFactorForm } from '../components/TwoFactorForm';
import { API_URL } from "../settings";
import { useDispatch } from 'react-redux';
import { actions } from '../store';
import { fetchProfile } from '../Globals';
import axios from 'axios';

export default function TwoFactorPage() {
    const data = useContext(loginContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isInvalid, setIsInvalid] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
        if(data.mfa.mfaType !== "TOTP" && data.mfa.mfaType !== "PickTwoFactor") return navigate("/login");
    }, []);

    return <TwoFactorForm isInvalid={isInvalid} error={error} showWebAuthn={data.mfa.mfaType === "PickTwoFactor"} onSubmit={async (values) => {
        try {

            setError("");
            setIsInvalid(false);
            
            const response = await axios.post(`${API_URL}/login`, {
                username: data.username,
                password: data.password,
                mfa: {
                    mfaType: 1,
                    totpToken: values.totpToken
                }
            }, {
                validateStatus: () => true
            });

            if(response.status === 200) {
                dispatch(actions.setAccessToken(response.data.message));
                if(await fetchProfile()) {
                    navigate("/profile");
                } else {
                    navigate("/login");
                }
            } else {
                console.error("Login error:", response.data.message);
                setError(response.data.message);
                setIsInvalid(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
            setIsInvalid(true);
        }
    }} />;
}