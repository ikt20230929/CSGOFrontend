import React from "react";
import { Form, useForm } from "react-hook-form"
import { API_URL } from "../Globals";

export default function RegisterPage() {
    const { register, control } = useForm();


    return [
		<h1>Enter your credentials:</h1>,
        <Form action={`${API_URL}/register`} encType="application/json" control={control} onSuccess={({ response }) => {
            console.log(response)
        }}>
            Username: <input {...register("username", { required: true })} />
            Email: <input {...register("email", { required: true })} type="email" />
            Password: <input {...register("password", { required: true })} type="password"/>
            <button>Submit</button>
        </Form>
	]
}