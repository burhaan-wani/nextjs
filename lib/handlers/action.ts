"use server";

import { ZodError } from "zod";
import { ZodSchema } from "zod/v3";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import connectDB from "../mongoose";

type ActionOptions<T> = {
    params: T;
    schema?: ZodSchema<T>;
    authorize?: boolean;
};

export async function action<T>({
    params,
    schema,
    authorize = false,
}: ActionOptions<T>) {
    let parsedParams = params;

    if (schema) {
        try {
            parsedParams = schema.parse(params);
        } catch (error) {
            if (error instanceof ZodError) {
                return new ValidationError(
                    error.flatten().fieldErrors as Record<string, string[]>,
                );
            }
            return new Error("Schema validation failed");
        }
    }

    let session: Session | null = null;
    if (authorize) {
        session = await auth();
        if (!session) {
            return new UnauthorizedError(
                "You are not logged in. Please Login first.",
            );
        }
    }

    await connectDB();

    return { params: parsedParams, session };
}
