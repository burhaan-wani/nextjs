import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const accounts = await Account.find();
        return NextResponse.json(
            { success: true, data: accounts },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = accountSchema.safeParse(body);
        if (!validatedData.success) {
            throw new ValidationError(
                validatedData.error.flatten().fieldErrors,
            );
        }

        await connectDB();

        const existingAccount = await Account.findOne({
            provider: validatedData.data.provider,
            providerAccountId: validatedData.data.providerAccountId,
        });
        if (existingAccount)
            throw new ForbiddenError(
                "Account with this provider already exists",
            );

        const newAccount = await Account.create(validatedData.data);

        return NextResponse.json(
            { success: true, data: newAccount },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
