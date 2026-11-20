import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { userSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        if (!email) {
            throw new NotFoundError("email");
        }
        const validatedData = userSchema.partial().safeParse({ email });
        if (!validatedData.success) {
            throw new ValidationError(
                validatedData.error.flatten().fieldErrors,
            );
        }
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User");
        }

        return NextResponse.json(
            { success: true, data: user },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
