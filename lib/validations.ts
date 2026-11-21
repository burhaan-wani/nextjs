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
    password: z.string().min(5),
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

export const userSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." }),
    email: z
        .string()
        .email({ message: "Please provide a valid email address." }),
    bio: z.string().optional(),
    image: z.string().url({ message: "Please provide a valid URL" }).optional(),
    location: z.string().optional(),
    protfolio: z
        .string()
        .url({ message: "Please provide a valid URL" })
        .optional(),
    reputation: z.number().optional(),
});

export const accountSchema = z.object({
    userId: z.string(),
    name: z.string(),
    password: z.string().min(5).optional(),
    image: z.string().url({ message: "Please provide a valid URL" }).optional(),
    provider: z.string(),
    providerAccountId: z.string(),
});

export const signInWithOAuthSchema = z.object({
    provider: z.enum(["google", "github"]),
    providerAccountId: z
        .string()
        .min(1, { message: "Provider Account ID is required." }),
    user: z.object({
        name: z.string().min(1),
        username: z.string().min(3),
        email: z.string().email(),
        image: z
            .string()
            .url({ message: "Please provide a valid URL" })
            .optional(),
    }),
});
