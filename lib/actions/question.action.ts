"use server";

import {
    ActionResponse,
    CreateQuestion,
    EditQuestion,
    ErrorResponse,
    PaginatedSearchParams,
    TQuestion,
} from "@/types/global";
import { action } from "../handlers/action";
import {
    askAQuestionSchema,
    editQuestionSchema,
    getQuestionSchema,
    PaginatedSearchParamsSchema,
} from "../validations";
import handleError from "../handlers/error";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import mongoose, { ClientSession } from "mongoose";
import TagQuestion from "@/database/tag-question.model";
import {
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "../http-errors";
import connectDB from "../mongoose";
import { connection } from "next/server";

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

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function editQuestion(
    params: EditQuestion,
): Promise<ActionResponse<IQuestion>> {
    const validationResult = await action({
        params,
        schema: editQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, tags, content, questionId } = validationResult.params;
    const userId = validationResult.session?.user?.id;

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingQuestion = await Question.findById(questionId)
            .populate<{ tags: ITag[] }>("tags")
            .session(session);

        if (!existingQuestion) {
            throw new NotFoundError("Question");
        }

        if (existingQuestion.author.toString() !== userId) {
            throw new UnauthorizedError(
                "You are not authorized to edit this question",
            );
        }

        if (title !== undefined) {
            existingQuestion.title = title;
        }
        if (content !== undefined) {
            existingQuestion.content = content;
        }

        const normalizedIncomingTags = Array.from(
            new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
        );

        const currentTagMap = new Map<string, ITag>(
            existingQuestion.tags.map((t: ITag) => [t.name.toLowerCase(), t]),
        );

        const tagsToAdd = normalizedIncomingTags.filter(
            (tagName) => !currentTagMap.has(tagName),
        );

        const tagsToRemove = existingQuestion.tags.filter(
            (tagDoc: ITag) =>
                !normalizedIncomingTags.includes(tagDoc.name.toLowerCase()),
        );

        // 1. Add new tags & TagQuestion links
        if (tagsToAdd.length > 0) {
            const newTagQuestionDocs: {
                questionId: mongoose.Types.ObjectId | string;
                tagId: mongoose.Types.ObjectId;
            }[] = [];

            const addedTagIds: mongoose.Types.ObjectId[] = [];

            for (const tagName of tagsToAdd) {
                const escapedName = escapeRegex(tagName);
                const updatedTag = await Tag.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${escapedName}$`, "i") } },
                    {
                        $setOnInsert: { name: tagName },
                        $inc: { questions: 1 },
                    },
                    {
                        upsert: true,
                        new: true,
                    },
                ).session(session);

                if (updatedTag) {
                    newTagQuestionDocs.push({
                        questionId: existingQuestion._id,
                        tagId: updatedTag._id,
                    });
                    addedTagIds.push(updatedTag._id);
                }
            }

            if (newTagQuestionDocs.length > 0) {
                await TagQuestion.insertMany(newTagQuestionDocs, { session });
            }

            // Normalize question.tags to ObjectIds before pushing newly added IDs
            existingQuestion.tags = [
                ...existingQuestion.tags.map((t: ITag) => t._id),
                ...addedTagIds,
            ];
        } else {
            existingQuestion.tags = existingQuestion.tags.map(
                (t: ITag) => t._id,
            );
        }

        // 2. Remove dropped tags, decrement counts, and delete TagQuestion links
        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map((t: ITag) => t._id);

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { questions: -1 } },
                { session },
            );

            await TagQuestion.deleteMany(
                {
                    questionId: existingQuestion._id,
                    tagId: { $in: tagIdsToRemove },
                },
                { session },
            );

            const removeSet = new Set(
                tagIdsToRemove.map((id: mongoose.Types.ObjectId) =>
                    id.toString(),
                ),
            );
            existingQuestion.tags = existingQuestion.tags.filter(
                (tagId: mongoose.Types.ObjectId) =>
                    !removeSet.has(tagId.toString()),
            );
        }

        await existingQuestion.save({ session });
        await session.commitTransaction();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(existingQuestion)),
        };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export async function getQuestion(params: {
    id: string;
}): Promise<ActionResponse<TQuestion>> {
    await connection();
    const validatedResult = await action({
        params,
        schema: getQuestionSchema,
    });

    if (validatedResult instanceof Error) {
        console.error("getQuestion action failed:", validatedResult);
        return handleError(validatedResult) as ErrorResponse;
    }

    try {
        const { id: questionId } = validatedResult.params;

        const question = await Question.findById(questionId)
            .populate("tags", "name")
            .populate("author", "_id name image")
            .lean();

        if (!question) {
            throw new NotFoundError("Question");
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(question)),
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getQuestions(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: TQuestion[]; isNext: boolean }>> {
    await connection();
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(ValidationError) as ErrorResponse;
    }
    const { page = 1, pageSize = 10, query, filter } = validationResult.params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const filterQuery: any = {};

    if (filter === "recommended")
        return { success: true, data: { questions: [], isNext: false } };

    if (query) {
        filterQuery.$or = [
            { title: { $regex: new RegExp(query, "i") } },
            { content: { $regex: new RegExp(query, "i") } },
        ];
    }

    let sortCriteria = {};
    switch (filter) {
        case "newest":
            sortCriteria = { createdAt: -1 };
            break;
        case "unanswered":
            filterQuery.answers = 0;
            sortCriteria = { createdAt: -1 };
            break;
        case "popular":
            sortCriteria = { upvotes: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalQuestions = await Question.countDocuments(filterQuery);
        const questions = await Question.find(filterQuery)
            .populate("tags", "name")
            .populate("author", "name image")
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;

        return {
            success: true,
            data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
