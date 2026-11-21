"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import { action } from "../handlers/action";
import handleError from "../handlers/error";
import connectDB from "../mongoose";
import { registerSchema } from "../validations";
import { ActionResponse, AuthCredentials, ErrorResponse } from "@/types/global";

export async function signUpWithCredentials(
    params: AuthCredentials,
): Promise<ActionResponse> {
    const validatedData = await action({
        params,
        schema: registerSchema,
    });

    if (validatedData instanceof Error) {
        return handleError(validatedData) as ErrorResponse;
    }

    const { name, username, email, password } = validatedData.params;
    const normalizedEmail = email.toLowerCase().trim();

    let session: mongoose.ClientSession | null = null;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        }).session(session);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const existingUsername = await User.findOne({ username }).session(
            session,
        );
        if (existingUsername) {
            throw new Error("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [newUser] = await User.create(
            [
                {
                    name,
                    username,
                    email: normalizedEmail,
                },
            ],
            { session },
        );

        await Account.create(
            [
                {
                    userId: newUser._id,
                    name,
                    username,
                    email: normalizedEmail,
                    password: hashedPassword,
                    provider: "credentials",
                    providerAccountId: normalizedEmail,
                },
            ],
            { session },
        );

        await session.commitTransaction();
    } catch (error) {
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }
        return handleError(error) as ErrorResponse;
    } finally {
        if (session) {
            await session.endSession();
        }
    }

    // Transaction is already committed and closed at this point
    try {
        signIn("credentials", {
            email: normalizedEmail,
            password,
            redirect: false,
        });
    } catch (error) {
        console.log("error: ", error);
        return handleError(error) as ErrorResponse;
    }

    return { success: true };
}
