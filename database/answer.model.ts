import mongoose, { Schema, Types, models } from "mongoose";

export interface IAnswer {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    question: Types.ObjectId;
    content: string;
    upvotes: number;
    downVotes: number;
}

const answerSchema = new Schema<IAnswer>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        content: { type: String, required: true },
        upvotes: { type: Number, default: 0 },
        downVotes: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const Answer =
    models?.answer || mongoose.model<IAnswer>("Answer", answerSchema);

export default Answer;
