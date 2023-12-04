import React, { useContext } from "react";
import { API_URL } from "../settings";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { loginContext } from "../context/LoginContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const data = useContext(loginContext);

    return <LoginForm submitURL={`${API_URL}/login`} onSuccess={async ({ response }) => {
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
            default: {
                alert("Unknown error!" + res)
            }
        }
    }} />
}