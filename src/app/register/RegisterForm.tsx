"use client"
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { DOMAIN } from "@/utils/constants";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (username === "") return toast.error('Username must be provided')
        if (email === "") return toast.error('Email must be provided')
        if (password === "") return toast.error('Password must be provided')

        try {
            setLoading(true)
            await axios.post(`${DOMAIN}/api/users/register`, { username, email, password })
            router.replace('/login')
            setLoading(false)
            router.refresh();
        }
        catch (error: any) {
            return toast.error(error?.response?.data?.message)
        }
    }
    return <div className="flex justify-center">
        <form className="flex flex-col max-w-[1000px] gap-4 " onSubmit={handleSubmit}>
            <input
                className="mb-4 border rounded p-2 text-xl"
                type="text"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="mb-4 border rounded p-2 text-xl"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="mb-4 border rounded p-2 text-xl"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" value="Register"
                className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold">
                Register
            </button>
        </form>
    </div>;
};

export default RegisterForm;
