"use server";

import {
    ActionResponse,
    CreateVoteParams,
    ErrorResponse,
    UpdateVoteCountParams,
} from "@/types/global";
import { action } from "../handlers/action";
import { createVoteShema, updateVoteSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "@/database";

export async function updateVote(
    params: UpdateVoteCountParams,
    session?: ClientSession,
): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: updateVoteSchema,
        authorize: true,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { targetId, targetType, voteType, change } = validationResult.params;
    const Model = targetType === "question" ? Question : Answer;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

    try {
        const _ = await Model.findByIdAndUpdate(
            targetId,
            { $inc: { [voteField]: change } },
            { session, returnDocument: "after" },
        );

        return { success: true };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function createVote(
    params: CreateVoteParams,
): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: createVoteShema,
        authorize: true,
    });
    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { targetId, targetType, voteType } = validationResult.params;
    const userId = validationResult.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingVote = await Vote.findOne({
            author: userId,
            actionId: targetId,
            actionType: targetType,
        }).session(session);

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                await Vote.deleteOne({ _id: existingVote._id }).session(
                    session,
                );
                await updateVote(
                    {
                        targetId,
                        targetType,
                        voteType,
                        change: -1,
                    },
                    session,
                );
            } else {
                await Vote.findByIdAndUpdate(
                    existingVote._id,
                    { voteType },
                    { new: true, session },
                );
                await updateVote(
                    {
                        targetId,
                        targetType,
                        voteType,
                        change: 1,
                    },
                    session,
                );
            }
        } else {
            await Vote.create(
                [
                    {
                        actionId: targetId,
                        actionType: targetType,
                        voteType,
                        author: userId,
                    },
                ],
                {
                    session,
                },
            );

            await updateVote(
                { targetId, targetType, voteType, change: 1 },
                session,
            );
        }

        await session.commitTransaction();

        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}
