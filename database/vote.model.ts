import mongoose, { models, Schema, Types } from "mongoose";

export interface IVote {
    _id: Types.ObjectId;
    id: Types.ObjectId;
    author: Types.ObjectId;
    type: "question" | "answer";
    voteType: "upvote" | "downvote";
}

const voteSchema = new Schema<IVote>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        id: { type: Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["question", "answer"], required: true },
        voteType: {
            type: String,
            enum: ["upvote", "downvote"],
            required: true,
        },
    },
    { timestamps: true },
);

const Vote = models?.vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
