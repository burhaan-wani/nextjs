import mongoose, { Schema, Types, models } from "mongoose";

export interface IQuestion {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    title: string;
    content: string;
    tags: Types.ObjectId[];
    upvotes: number;
    views: number;
    downvotes: number;
    answers: number;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        views: { type: Number, default: 0 },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        answers: { type: Number, default: 0 },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

const Question =
    models?.Question || mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
