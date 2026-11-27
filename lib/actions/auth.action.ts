"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User, { IUser } from "@/database/user.model";

import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
    ActionResponse,
    AuthCredentials,
    ErrorResponse,
    PaginatedSearchParams,
    ProfileParams,
} from "@/types/global";
import { action } from "../handlers/action";
import {
    loginSchema,
    PaginatedSearchParamsSchema,
    profileSchema,
    registerSchema,
} from "../validations";
import { connection } from "next/server";
import { Answer, Question } from "@/database";

export async function signUpWithCredentials(
    params: AuthCredentials,
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: registerSchema });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { name, username, email, password } = validationResult.params!;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingUser = await User.findOne({ email }).session(session);

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

        const [newUser] = await User.create([{ username, name, email }], {
            session,
        });

        await Account.create(
            [
                {
                    userId: newUser._id,
                    name,
                    email,
                    provider: "credentials",
                    providerAccountId: email,
                    password: hashedPassword,
                },
            ],
            { session },
        );

        await session.commitTransaction();

        await signIn("credentials", { email, password, redirect: false });

        return { success: true };
    } catch (error) {
        await session.abortTransaction();

        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export async function signInWithCredentials(
    params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
    const validationResult = await action({ params, schema: loginSchema });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { email, password } = validationResult.params!;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) throw new NotFoundError("User");

        const existingAccount = await Account.findOne({
            provider: "credentials",
            providerAccountId: email,
        });

        if (!existingAccount) throw new NotFoundError("Account");

        const passwordMatch = await bcrypt.compare(
            password,
            existingAccount.password,
        );

        if (!passwordMatch) throw new Error("Password does not match");

        await signIn("credentials", { email, password, redirect: false });

        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getAllUsers(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: IUser[]; isNext: boolean }>> {
    await connection();
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { query, filter, page = 1, pageSize = 10 } = validationResult.params;
    const currentPage = Math.max(1, Number(page) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    const skip = (currentPage - 1) * limit;

    const filterQuery: Record<string, unknown> = {};

    if (query && query.trim() !== "") {
        const escapedQuery = query
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filterQuery.$or = [
            { name: { $regex: new RegExp(escapedQuery, "i") } },
            { username: { $regex: new RegExp(escapedQuery, "i") } },
        ];
    }

    let sortCriteria: Record<string, 1 | -1> = { createdAt: -1 };
    switch (filter) {
        case "latest":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "popular":
            sortCriteria = { reputation: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery);
        const users = await User.find(filterQuery)
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalUsers > skip + users.length;

        return {
            success: true,
            data: {
                users: JSON.parse(JSON.stringify(users)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUserProfile(params: ProfileParams): Promise<
    ActionResponse<{
        user: IUser;
        totalQuestions: number;
        totalAnswers: number;
    }>
> {
    const validationResult = await action({ params, schema: profileSchema });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId } = validationResult.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(new NotFoundError("User")) as ErrorResponse;
    }

    try {
        const user = await User.findById(userId).lean();
        if (!user) {
            throw new NotFoundError("User");
        }

        const [totalQuestions, totalAnswers] = await Promise.all([
            Question.countDocuments({ author: userId }),
            Answer.countDocuments({ author: userId }),
        ]);

        return {
            success: true,
            data: {
                user: JSON.parse(JSON.stringify(user)),
                totalQuestions,
                totalAnswers,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
