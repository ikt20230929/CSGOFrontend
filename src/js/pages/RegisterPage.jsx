import React from "react";
import { API_URL } from "../settings";
import  { RegisterForm } from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const navigate = useNavigate();
    return <RegisterForm onSubmit={async ( values ) => {
        try {
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
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error);
        }
    }} />;
}