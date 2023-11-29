import React, { createContext, useContext } from "react";
import { useForm } from "react-hook-form"
import { API_URL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { LoginContext } from "../context/LoginContext";

export default function LoginPage() {
    const { getValues } = useForm();
    const navigate = useNavigate();
    const data = useContext(LoginContext);

    return <LoginForm submitURL={`${API_URL}/login`} onSuccess={async ({ response }) => {
        localStorage.setItem("accessToken", (await response.json()).accessToken);
        return navigate("/profile");
    }} onError={async ({ response }) => {
        let res = await response.text();
        switch (res) {
            case "EnterTotp": {
                const values = getValues();
                data.username = values.username;
                data.password = values.password;
                data.mfa.mfaType = "TOTP";
                return navigate("/login/totp");
            }
            default: {
                alert("Unknown error!" + res)
            }
        }
    }} />
}