import React, { useContext, useState } from "react";
import { API_URL } from "../settings";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { loginContext } from "../context/LoginContext";
import { useDispatch } from "react-redux";
import { actions } from "../store";
import { fetchProfile } from "../Globals";
import axios from "axios";

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useContext(loginContext);
    const [invalid, setInvalid] = useState(false);

    const handleLogin = async(values) => {
        data.username = values.username;
        data.password = values.password;

        try {
            const loginResponse = await axios.post(`${API_URL}/login`, {
                username: data.username,
                password: data.password
            }, {
                validateStatus: () => true
            });

            if (loginResponse.status !== 200) {
                switch (loginResponse.data.message) {
                    case "EnterTotp":
                        data.mfa.mfaType = "TOTP";
                        navigate("/login/totp");
                        break;
                    case "InvalidCredential":
                        setInvalid(true);
                        break;
                    case "EnterWebAuthn":
                    case "PickTwoFactor":
                        data.mfa.mfaType = "PickTwoFactor";
                        navigate("/login/webauthn");
                        break;
                    default:
                        console.error("Unknown error!" + loginResponse.data.message);
                        alert(loginResponse.data.message);
                        break;
                }
            } else {
                dispatch(actions.setAccessToken(loginResponse.data.message));

                if (await fetchProfile()) {
                    navigate("/profile");
                } else {
                    // how did we get here?
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error);
        }
    };

    return (
        <LoginForm
            onSubmit={handleLogin}
            isInvalid={invalid}
        />
    );
}