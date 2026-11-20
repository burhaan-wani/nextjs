import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import connectDB from "@/lib/mongoose";
import { userSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

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
        const user = await User.findById(id);
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
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new NotFoundError("User");
        }

        return NextResponse.json(
            { success: true, data: user },
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

        const validatedData = userSchema.partial().parse(body);

        const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
            returnDocument: "after",
        });

        if (!updatedUser) {
            throw new NotFoundError("User");
        }

        return NextResponse.json(
            { success: true, data: updatedUser },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
