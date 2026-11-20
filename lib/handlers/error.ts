import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError } from "zod";

export type ResponseType = "api" | "server";

const formatResponse = (
    ResponseType: ResponseType,
    status: number,
    message: string,
    errors?: Record<string, string[]> | undefined,
) => {
    const responseObject = {
        success: false,
        error: {
            message,
            details: errors ?? {},
        },
    };

    return ResponseType === "server"
        ? { status, ...responseObject }
        : NextResponse.json(responseObject, { status });
};

const handleError = (error: unknown, ResponseType: ResponseType = "server") => {
    if (error instanceof RequestError) {
        return formatResponse(
            ResponseType,
            error.statusCode,
            error.message,
            error.errors,
        );
    }
    if (error instanceof ZodError) {
        const validationError = new ValidationError(
            error.flatten().fieldErrors as Record<string, string[]>,
        );
        return formatResponse(
            ResponseType,
            validationError.statusCode,
            validationError.message,
            validationError.errors,
        );
    }

    if (error instanceof Error) {
        return formatResponse(ResponseType, 500, error.message);
    }

    return formatResponse(ResponseType, 500, "An unexpected error occured");
};

export default handleError;
