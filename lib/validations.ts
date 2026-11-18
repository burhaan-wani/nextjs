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
