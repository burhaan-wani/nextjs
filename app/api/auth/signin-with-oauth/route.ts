import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { signInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { user, provider, providerAccountId } = await request.json();

        const validatedData = signInWithOAuthSchema.safeParse({
            user,
            provider,
            providerAccountId,
        });
        if (!validatedData.success) {
            throw new ValidationError(
                validatedData.error.flatten().fieldErrors,
            );
        }

        const {
            user: { email, name, username, image },
        } = validatedData.data;

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            [existingUser] = await User.create(
                [
                    {
                        email,
                        name,
                        username,
                        image,
                    },
                ],
                { session },
            );
        } else {
            const updatedData: { name?: string; image?: string } = {};
            if (existingUser.name !== name) updatedData.name = name;
            if (existingUser.image !== image) updatedData.image = image;

            if (Object.keys(updatedData).length > 0) {
                existingUser = await User.findByIdAndUpdate(
                    { _id: existingUser._id },
                    { $set: updatedData },
                    { session, returnDocument: "after" },
                );
            }
        }

        const existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId,
        }).session(session);
        if (!existingAccount) {
            await Account.create(
                [
                    {
                        userId: existingUser._id,
                        name,
                        username,
                        image,
                        email,
                        provider,
                        providerAccountId,
                    },
                ],
                { session },
            );
        }

        await session.commitTransaction();
        return NextResponse.json({ success: true });
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, "api") as APIErrorResponse;
    } finally {
        await session.endSession();
    }
}
