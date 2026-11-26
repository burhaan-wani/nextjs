"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import { getQuestionSchema } from "../validations";
import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function addToCollections(params: {
    id: string;
}): Promise<ActionResponse<{ saved: boolean }>> {
    const validationResult = await action({
        params,
        schema: getQuestionSchema,
        authorize: true,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const questionId = validationResult.params.id;
    const userId = validationResult.session?.user?.id;

    if (!userId) {
        return handleError(
            new UnauthorizedError("User not authenticated"),
        ) as ErrorResponse;
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) throw new NotFoundError("Question");

        const existingCollection = await Collection.findOne({
            author: userId,
            question: questionId,
        });

        if (existingCollection) {
            await Collection.findByIdAndDelete(existingCollection._id);
            revalidatePath(ROUTES.QUESTION_DETAILS(questionId));
            revalidatePath(ROUTES.HOME);
            return { success: true, data: { saved: false } };
        }

        await Collection.create({
            author: userId,
            question: questionId,
        });

        revalidatePath(ROUTES.QUESTION_DETAILS(questionId));
        revalidatePath(ROUTES.HOME);

        return {
            success: true,
            data: { saved: true },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function hasSavedQuestion(params: {
    id: string;
}): Promise<ActionResponse<{ saved: boolean }>> {
    const validationResult = await action({
        params,
        schema: getQuestionSchema.transform((v) => ({ id: v.id })),
        authorize: true, // or use a { questionId: z.string() } schema
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const userId = validationResult.session?.user?.id;
    if (!userId) {
        return { success: true, data: { saved: false } };
    }

    try {
        const existing = await Collection.findOne({
            author: userId,
            question: params.id,
        }).lean();

        revalidatePath(ROUTES.HOME);
        revalidatePath(ROUTES.QUESTION_DETAILS(params.id));
        return {
            success: true,
            data: { saved: Boolean(existing) },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
