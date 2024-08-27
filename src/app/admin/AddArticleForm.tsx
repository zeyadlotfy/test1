"use client"

import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const AddArticleForm = () => {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const formSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title === "") return toast.error("Title is required")
        if (description === "") return toast.error("Description is required")

        try {
            await axios.post(`${DOMAIN}/api/articles`, { title, description })
            setTitle("")
            setDescription("")
            toast.success("New article added")
            router.refresh()
        }
        catch (error: any) {
            toast.error(error?.response?.data?.message)

        }


        console.log({ title, description });
    }
    return <form onSubmit={formSubmitHandler} className="flex flex-col">
        <input type="text" className="mb-4 border rounded p-2 text-xl "
            placeholder="Enter Article Title"
            value={title} onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
            className="mb-4 border rounded p-2 lg:text-xl resize-none"
            rows={5} placeholder="Enter Article Description" value={description} onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold">
            Add Article
        </button>

    </form>
};

export default AddArticleForm;
