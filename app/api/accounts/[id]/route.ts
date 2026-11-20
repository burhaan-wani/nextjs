import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import Account from "@/database/account.model";
import connectDB from "@/lib/mongoose";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (!id) {
            throw new NotFoundError("ID");
        }

        await connectDB();
        const account = await Account.findById(id);
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

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (!id) {
            throw new NotFoundError("ID");
        }

        await connectDB();
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            throw new NotFoundError("Account");
        }

        return NextResponse.json(
            { success: true, data: account },
            { status: 204 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (!id) {
            throw new NotFoundError("ID");
        }

        await connectDB();
        const body = await request.json();

        const validatedData = accountSchema.partial().parse(body);

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            validatedData,
            {
                returnDocument: "after",
            },
        );

        if (!updatedAccount) {
            throw new NotFoundError("Account");
        }

        return NextResponse.json(
            { success: true, data: updatedAccount },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
