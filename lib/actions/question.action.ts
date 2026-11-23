"use server";

import { ActionResponse, CreateQuestion, ErrorResponse } from "@/types/global";
import { action } from "../handlers/action";
import { askAQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import Question, { IQuestion } from "@/database/question.model";
import Tag from "@/database/tag.model";
import mongoose from "mongoose";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(
    params: CreateQuestion,
): Promise<ActionResponse<IQuestion>> {
    const validationResult = await action({
        params,
        schema: askAQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { params } = validationResult;
        const userId = validationResult.session?.user?.id;

        const [question] = await Question.create(
            [
                {
                    title: params.title,
                    content: params.content,
                    author: userId,
                },
            ],
            { session },
        );

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for (const tag of params.tags) {
            const normalizedTag = tag.trim().toLowerCase();
            const escapedTag = normalizedTag.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );

            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${escapedTag}$`, "i") } },
                {
                    $setOnInsert: { name: normalizedTag },
                    $inc: { questions: 1 },
                },
                {
                    upsert: true,
                    new: true,
                    session,
                },
            );
            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({
                tagId: existingTag._id,
                questionId: question._id,
            });
        }
        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagIds } },
        }).session(session);

        await TagQuestion.insertMany(tagQuestionDocuments, { session });

        await session.commitTransaction();
        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}
