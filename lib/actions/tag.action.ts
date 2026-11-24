"use server";

import {
    ActionResponse,
    ErrorResponse,
    PaginatedSearchParams,
} from "@/types/global";
import { action } from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/error";
import { Tag } from "@/database";
import { ITag } from "@/database/tag.model";
import { connection } from "next/server";

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

    const { query, filter, page = 1, pageSize = 3 } = validationResult.params;

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
