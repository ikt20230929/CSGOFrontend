import React from "react";
import { API_URL } from "../settings";
import  { RegisterForm } from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    return <RegisterForm submitURL={`${API_URL}/register`} onSuccess={async ({ response }) => {
        var res = await response.json();
        if(res.status == "OK") {
            return navigate("/login");
        }
    }} onError={async ({ response }) => {
        let res = await response.json();
        alert(res.message);
    }} />
}