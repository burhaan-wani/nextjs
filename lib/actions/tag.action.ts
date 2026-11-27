"use server";

import {
    ActionResponse,
    ErrorResponse,
    PaginatedSearchParams,
    TagQuestionParams,
    TQuestion,
} from "@/types/global";
import { action } from "../handlers/action";
import { PaginatedSearchParamsSchema, tagQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import { Question, Tag } from "@/database";
import { connection } from "next/server";
import { NotFoundError } from "../http-errors";
import { ITag } from "@/database/tag.model";
import connectDB from "../mongoose";

export async function getTags(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: ITag[]; isNext: boolean }>> {
    await connection();
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { query, filter, page = 1, pageSize = 6 } = validationResult.params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const fitlerQuery: any = {};
    if (query) {
        fitlerQuery.$or = [{ name: { $regex: new RegExp(query, "i") } }];
    }

    let sortCriteria = {};
    switch (filter) {
        case "popular":
            sortCriteria = { question: -1 };
            break;
        case "newest":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
    }

    try {
        const totalTags = await Tag.countDocuments(fitlerQuery);
        const tags = await Tag.find(fitlerQuery)
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalTags > skip + tags.length;
        return { success: true, data: { tags: tags, isNext } };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getTagQuestions(
    params: TagQuestionParams,
): Promise<
    ActionResponse<{ tag: ITag; questions: TQuestion[]; isNext: boolean }>
> {
    const validationResult = await action({
        params,
        schema: tagQuestionSchema,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {
        query = "",
        page = 1,
        pageSize = 6,
        tagId,
    } = validationResult.params;
    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    try {
        const tag = await Tag.findById(tagId);
        if (!tag) throw new NotFoundError("Tag");

        const filterQuery: any = {
            tags: { $in: [tagId] },
        };

        if (query) {
            filterQuery.title = { $regex: new RegExp(query, "i") };
        }

        const totalQuestion = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .select(
                "_id title views answers upvotes downvotes author createdAt",
            )
            .populate("author", "name image")
            .populate("tags", "name")
            .lean()
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestion > skip + questions.length;
        return { success: true, data: { tag, questions, isNext } };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getPopularTags(): Promise<ActionResponse<ITag[]>> {
    try {
        await connection();
        await connectDB();

        const tags = await Tag.find().sort({ questions: -1 }).limit(5);
        return {
            success: true,
            data: JSON.parse(JSON.stringify(tags)),
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
