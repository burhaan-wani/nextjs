"use server";

import {
    ActionResponse,
    ErrorResponse,
    PaginatedSearchParams,
    TQuestion,
} from "@/types/global";
import { getQuestionSchema, PaginatedSearchParamsSchema } from "../validations";
import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import mongoose, { PipelineStage } from "mongoose";

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

export async function getSavedQuestions(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: TQuestion[]; isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const userId = validationResult.session?.user?.id;
    if (!userId) {
        return handleError(
            new UnauthorizedError("User not authenticated"),
        ) as ErrorResponse;
    }

    const { query, filter, page = 1, pageSize = 10 } = validationResult.params;
    const currentPage = Math.max(1, Number(page) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    const skip = (currentPage - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return handleError(
            new UnauthorizedError("Invalid user session identifier"),
        ) as ErrorResponse;
    }
    const matchStage: Record<string, unknown> = {
        author: new mongoose.Types.ObjectId(userId),
    };

    const sortStage: Record<string, 1 | -1> = {};
    switch (filter) {
        case "mostrecent":
            sortStage["question.createdAt"] = -1;
            break;
        case "oldest":
            sortStage["question.createdAt"] = 1;
            break;
        case "mostvoted":
            sortStage["question.upvotes"] = -1;
            break;
        case "mostanswered":
            sortStage["question.answers"] = -1;
            break;
        case "mostviewed":
            sortStage["question.views"] = -1;
            break;
        default:
            sortStage.createdAt = -1; // recently saved to collection
            break;
    }

    const pipeline: PipelineStage[] = [
        // 1. Only saved items belonging to the logged-in user
        { $match: matchStage },

        // 2. Join with questions collection
        {
            $lookup: {
                from: "questions",
                localField: "question",
                foreignField: "_id",
                as: "question",
            },
        },
        { $unwind: "$question" },

        // 3. Join question author (User)
        {
            $lookup: {
                from: "users",
                localField: "question.author",
                foreignField: "_id",
                as: "author",
            },
        },
        { $unwind: "$author" },

        // 4. Join question tags (Tag)
        {
            $lookup: {
                from: "tags",
                localField: "question.tags",
                foreignField: "_id",
                as: "tags",
            },
        },
    ];

    // 5. Optional search filter across question title, content, and tag names
    if (query && query.trim() !== "") {
        const escapedQuery = query
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedQuery, "i");

        pipeline.push({
            $match: {
                $or: [
                    { "question.title": regex },
                    { "question.content": regex },
                    { "tags.name": regex },
                ],
            },
        });
    }

    // 6. Facet for paginated results + total count in a single query
    pipeline.push(
        { $sort: sortStage },
        {
            $facet: {
                items: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: "$question._id",
                            title: "$question.title",
                            content: "$question.content",
                            tags: {
                                $map: {
                                    input: "$tags",
                                    as: "tag",
                                    in: {
                                        _id: "$$tag._id",
                                        name: "$$tag.name",
                                    },
                                },
                            },
                            author: {
                                _id: "$author._id",
                                name: "$author.name",
                                username: "$author.username",
                                image: "$author.image",
                            },
                            createdAt: "$question.createdAt",
                            updatedAt: "$question.updatedAt",
                            views: { $ifNull: ["$question.views", 0] },
                            answers: { $ifNull: ["$question.answers", 0] },
                            upvotes: { $ifNull: ["$question.upvotes", 0] },
                            downvotes: { $ifNull: ["$question.downvotes", 0] },
                            isSaved: { $literal: true },
                        },
                    },
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    );

    try {
        const results = await Collection.aggregate(pipeline);
        const questions: TQuestion[] = JSON.parse(
            JSON.stringify(results[0]?.items ?? []),
        );
        const total = results[0]?.totalCount?.[0]?.count ?? 0;
        const isNext = total > skip + questions.length;

        return {
            success: true,
            data: {
                questions,
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
