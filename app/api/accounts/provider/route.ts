import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { providerAccountId } = await request.json();
        if (!providerAccountId) {
            throw new NotFoundError("Provider Account ID");
        }

        const validatedData = accountSchema
            .partial()
            .safeParse({ providerAccountId });
        if (!validatedData.success) {
            throw new ValidationError(
                validatedData.error.flatten().fieldErrors,
            );
        }
        await connectDB();
        const account = await Account.findOne({
            providerAccountId: validatedData.data.providerAccountId,
        });
        if (!account) {
            throw new NotFoundError("Account");
        }

        return NextResponse.json(
            { success: true, data: account },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
