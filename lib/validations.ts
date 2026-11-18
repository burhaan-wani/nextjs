import { z } from "zod/v3";

export const loginSchema = z.object({
    email: z.string({ message: "Email is required" }),
    password: z
        .string()
        .min(3, { message: "Password must contain atleast 3 characters" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name must contain atleast 1 character" }),
    userName: z
        .string()
        .min(1, { message: "Username must contain atleast 1 character" }),
    email: z.string({ message: "Email is required" }),
    password: z.string(),
});

export const askAQuestionSchema = z.object({
    title: z
        .string()
        .min(5, { message: "Title must be atleast 5 characters long" })
        .max(100, { message: "Title cannot exceed 100 characters" }),
    description: z.string().min(1, { message: "Description is required" }),
    tags: z
        .array(
            z
                .string()
                .min(1, { message: "Tag must be atleast 1 character long" })
                .max(15, { message: "Tag name cannot exceed 15 characters" }),
        )
        .min(1, { message: "Tags must contain atleast 1 tag" })
        .max(5, { message: "There can only be 5 tags" }),
});
