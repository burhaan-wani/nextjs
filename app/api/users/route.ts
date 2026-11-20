import User, { IUser } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { userSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const users = await User.find();
        return NextResponse.json(
            { success: true, data: users },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validatedData = userSchema.safeParse(body);
        if (!validatedData.success) {
            throw new ValidationError(
                validatedData.error.flatten().fieldErrors,
            );
        }

        const { email, username } = validatedData.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new Error("Username already taken");
        }

        const newUser = await User.create(validatedData.data);
        return NextResponse.json(
            { success: true, data: newUser },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
