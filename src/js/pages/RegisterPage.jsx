import React from "react";
import { API_URL } from "../settings";
import  { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
    return <RegisterForm submitURL={`${API_URL}/register`} onSuccess={async ({ response }) => {
        console.log(await response.json());
    }} onError={async ({ response }) => {
        let res = await response.text();
        alert(res);
    }} />
}