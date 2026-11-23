import mongoose, { models, Schema, Types } from "mongoose";

export interface ITagQuestion {
    _id: Types.ObjectId;
    tagId: Types.ObjectId;
    questionId: Types.ObjectId;
}

const tagQuestionSchema = new Schema<ITagQuestion>(
    {
        tagId: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
        questionId: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
    },
    { timestamps: true },
);

const TagQuestion =
    models?.TagQuestion ||
    mongoose.model<ITagQuestion>("TagQuestion", tagQuestionSchema);

export default TagQuestion;
