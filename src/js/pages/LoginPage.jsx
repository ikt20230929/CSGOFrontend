import React, { useState } from "react";
import { Form, useForm } from "react-hook-form"
import { API_URL } from "../Globals";

export default function LoginPage() {
    const { register, getValues, control } = useForm();
    const [ MFAType, setMFAType ] = useState("");
    const [ userData, setUserData ] = useState({});

    switch(MFAType) {
        case "TOTP": {
            return [
                <h3>Entered so far: {userData.username} {userData.password}</h3>,
                <h1>Two-factor authentication</h1>,
                <h2>Enter the code from your authenticator app:</h2>,
                <Form action={`${API_URL}/login`} encType="application/json" control={control} onSuccess={async({response}) => {
                    localStorage.setItem("accessToken", (await response.json()).accessToken);
                }}>
                    <input hidden {...register("username")} value={userData.username} />
                    <input hidden {...register("password")} value={userData.password} />
                    <input hidden {...register("mfa.mfaType")} value="1" />
                    Code: <input {...register("mfa.totpToken", { required: true })} />
                    <button>Submit</button>
                </Form>
            ]
        }

        default: {
            return [
                <h1>Enter your credentials:</h1>,
                <Form action={`${API_URL}/login`} encType="application/json" control={control} onSuccess={async({ response }) => {
                    localStorage.setItem("accessToken", (await response.json()).accessToken);
                }} onError={async({ response }) => {
                   let res = await response.text();
                   switch(res) {
                        case "EnterTotp": {
                            const values = getValues();
                            setUserData({
                                username: values.username,
                                password: values.password
                            });
                            setMFAType("TOTP");
                            break;
                        }
                        default: {
                            alert("Unknown error!"+res)
                        }
                   }
                }}>
                    Username: <input {...register("username", { required: true })} />
                    Password: <input type="password" {...register("password", { required: true })} />
                    <button>Submit</button>
                </Form>
            ]
        }
    }
}