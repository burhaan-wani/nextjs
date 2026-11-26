import mongoose, { models, Schema, Types } from "mongoose";

export interface IVote {
    _id: Types.ObjectId;
    actionId: Types.ObjectId;
    author: Types.ObjectId;
    actionType: "question" | "answer";
    voteType: "upvote" | "downvote";
}

const voteSchema = new Schema<IVote>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        actionId: { type: Schema.Types.ObjectId, required: true },
        actionType: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
        voteType: {
            type: String,
            enum: ["upvote", "downvote"],
            required: true,
        },
    },
    { timestamps: true },
);

const Vote = models?.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
