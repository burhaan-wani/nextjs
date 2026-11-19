import mongoose, { Schema, Types, models } from "mongoose";

export interface IQuestion {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    title: string;
    content: string;
    tags: Types.ObjectId[];
    upvotes: number;
    downVotes: number;
    answers: number;
}

const questionSchema = new Schema<IQuestion>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: {
            type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
            required: true,
        },
        upvotes: { type: Number, default: 0 },
        downVotes: { type: Number, default: 0 },
        answers: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

const Question =
    models?.question || mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
