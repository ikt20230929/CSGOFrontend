import React, { useState } from "react";
import { API_URL } from "../settings";
import  { RegisterForm } from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);

    return <RegisterForm  isInvalid={isInvalid} error={error} onSubmit={async ( values ) => {
        try {

            setError("");
            setIsInvalid(false);

            const response = await axios.post(`${API_URL}/register`, {
                username: values.username,
                email: values.email,
                password: values.password
            }, {
                validateStatus: () => true
            });

            if (response.status === 200) {
                navigate("/login");
            } else {
                console.error("Registration error:", response.data.message);
                setError(response.data.message);
                setIsInvalid(true);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message);
            setIsInvalid(true);
        }
    }} />;
}