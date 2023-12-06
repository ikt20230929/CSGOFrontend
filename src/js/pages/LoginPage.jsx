import React, { useContext, useState } from "react";
import { API_URL } from "../settings";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { loginContext } from "../context/LoginContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const data = useContext(loginContext);
    const [invalid, setInvalid] = useState(false);

    return <LoginForm submitURL={`${API_URL}/login`} isInvalid={invalid} onSuccess={async ({ response }) => {
        localStorage.setItem("accessToken", (await response.json()).accessToken);
        return navigate("/profile");
    }} onSubmit={response => {
        data.username = response.username;
        data.password = response.password;
    }} onError={async ({ response }) => {
        let res = await response.text();
        switch (res) {
            case "EnterTotp": {
                data.mfa.mfaType = "TOTP";
                return navigate("/login/totp");
            }
            case "InvalidCredentials": {
                setInvalid(true);
                return;
            }
            default: {
                alert("Unknown error!" + res)
            }
        }
    }} />
}