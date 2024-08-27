import { z } from "zod"

export const createarticleSchema = z.object({
    title: z.string(
        {
            required_error: "title required",
            invalid_type_error: "title should be of type string"
        }
    ).min(2),
    description: z.string().min(5)
})

export const registerSchema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().email().min(3).max(200),
    password: z.string().min(3),
})

export const loginSchema = z.object({
    email: z.string().email().min(3).max(200),
    password: z.string().min(3),
})

export const createcommentSchema = z.object({
    text: z.string().min(1),
    articleId: z.number()
})
export const updateUserSchema = z.object({
    username: z.string().min(2).max(100).optional(),
    email: z.string().email().min(3).max(200).optional(),
    password: z.string().min(3).optional(),
})