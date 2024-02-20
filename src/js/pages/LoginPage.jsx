import React, { useContext, useState } from "react";
import { API_URL } from "../settings";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { loginContext } from "../context/LoginContext";
import { useDispatch } from "react-redux";
import { actions } from "../store";
import { fetchProfile } from "../Globals";

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useContext(loginContext);
    const [invalid, setInvalid] = useState(false);

    return <LoginForm submitURL={`${API_URL}/login`} isInvalid={invalid} onSuccess={async ({ response }) => {
        var token = (await response.json()).message;
        dispatch(actions.setAccessToken(token));
        if(await fetchProfile()) {
            return navigate("/profile");
        }else{
            // how did we get here?
            return navigate("/login");
        }
        
    }} onSubmit={response => {
        data.username = response.username;
        data.password = response.password;
    }} onError={async ({ response }) => {
        let res = await response.json();
        switch (res.message) {
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