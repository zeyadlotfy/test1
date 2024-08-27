"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
type Props = {};
const DOMAIN = "http://localhost:3000"
const LoginForm = (props: Props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const formSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "") return toast.error("Email is required")
        if (password === "") return toast.error("Password is required")

        try {
            await axios.post(`${DOMAIN}/api/users/login`, { email, password })
            router.replace('/')
            router.refresh();
            // localStorage.setItem('token', response.data.token)
            toast.success("Logged in successfully")
        } catch (error: any) {
            toast.error(error?.response?.data.message)
        }



    }

    return <form onSubmit={formSubmitHandler}>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
    </form>
};

export default LoginForm;
